var Queue = require('bull');
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

var getSTLDataQueue   =   new Queue('admproductcost', 'redis://127.0.0.1:6379');
getSTLDataQueue.process(function (job, done) {
    console.log("COST_Job Queue")
    console.log(job.data);
    var productInfo     =   job.data.productInfo;
    getSTLData(productInfo, false, function (data) {
        var productId       =   productInfo.productId;
        //TODO: Update Product with incoming data
        console.log("STL_DATA: ",data);
        getAdminProductDetailForCost(productId,data,function () {
            done();
        })

    })
});


var getUserSTLDataQueue   =   new Queue('usrproductcost', 'redis://127.0.0.1:6379');
getUserSTLDataQueue.process(function (job, done) {
    console.log("COST_Job Queue")
    console.log(job.data);
    var productInfo     =   job.data.productInfo;

    processSTL("",productInfo.stlFile,false,function (obj) {
        getUserProductDetailForCost(productInfo,obj,function (productData) {
            //callback(obj);
            done();
        })

    })
});


function getSTLData(productInfo, isUser, callback) {
    console.log("Get_STL_DATA");
    var productId       =   productInfo.productId;
    var images          =   productInfo.productImages;
    var stlFile         =   images[0];
    for (var i=0;i<images.length;i++){
        if(images[i].indexOf(".stl") != -1 || images[i].indexOf(".STL") != -1){
            stlFile = images[i];
        }
    }
    console.log("Preparing to download: ")
    console.log('temp_stl/admin_'+productId+'.stl');
    var download    =   require('download-to-file');
    download(stlFile, 'temp_stl/admin_'+productId+'.stl', function (err) {
        if (err){
            console.log("File Download Error");
        }
        console.log('Download finished');
        processSTL("admin_",productId,true,function (obj) {
            callback(obj);
        })


    });
}

function processSTL(fileprefix,filename, deletefile, callback) {
    //STL Operation
    var productId = filename
    var shell = require('shelljs');
    var command = '/home/ubuntu/poc/CuraEngine/build/CuraEngine slice -v -j /home/ubuntu/poc/Cura/resources/definitions/json.def.json -o "test.gcode" -e0 -s infill_line_distance=0 -e0 -l "/home/ubuntu/pro/3dclubhouse/temp_stl/'+fileprefix+productId+'.stl"'
    var child = shell.exec(command, {async:true}, function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
        stderr = stderr.replace(/"/g, "'");
        var splitter = stderr.split("-s");
        var resp = {};
        //resp.plain = stderr;
        //resp.splitted = splitter.toString();
        resp.data = splitter;

        resp = JSON.stringify(resp);
        var bkp = resp;
        var finalData = resp.replace(/\\/g, "");
        //finalData = finalData.replace("\" ", "\"");
        //finalData = finalData.replace("\"\s", "\"");
        finalData = finalData.replace(/\s/g,"");
        finalData = finalData.replace(" ","");
        //finalData   =   JSON.parse(finalData);

        var parsed  =   JSON.parse(finalData);
        parsed      =   parsed.data;
        var obj     =   {};

        var async = require('async');
        async.eachSeries(parsed,function (eachString, done) {
            eachString  =   eachString.replace("=",":");
            eachString  =   eachString.replace(/["']/g, "");
            var keySplit    =   eachString.split(":");
            obj[keySplit[0]] = keySplit[1];
            done();
        },function (err) {
            obj.backup = (splitter);
            var lastObj = splitter[splitter.length - 1];
            lastObj = lastObj.split("\n").map(function (t) {
                return t.replace(";", "");
            });
            for (var k = 0; k < lastObj.length; k++) {
                var each = lastObj[k];
                each = each.replace(";", "");
                var splitObj = each.split(":");
                if (splitObj.length == 2) {
                    obj[splitObj[0]] = splitObj[1];
                }
            }
            if(deletefile) {
                var fs = require('fs');
                fs.unlink('/home/ubuntu/pro/3dclubhouse/temp_stl/admin_' + productId + '.stl', function (errr, statss) {
                    console.log("File Unlinked");
                    callback(obj);
                });
            }else{
                callback(obj);
            }

        });
    });
}

function getUserProductDetailForCost(productInfo, curaData, callback) {
    var filament    =   1;
    var print_time  =   1;

    var _filament   =   curaData["Filament used"];
    var _print_time =   curaData["Print time"];
    if(_filament != undefined){
        _filament    =   _filament.trim();
        _filament    =   _filament.replace("m","");
        filament    =   parseFloat(_filament);
    }
    if(_print_time != undefined){
        _print_time =   _print_time.trim();
        _print_time =   parseFloat(_print_time)
        print_time  =   _print_time/60;
    }

    var materialId  =   productInfo.productMaterialId;

    var query   =   "select * from materials where pkMaterialId = ?";
    connection.executeQuery(query,[materialId],function (err, materialInfo) {
        console.log(materialInfo);
        if(!err && materialInfo.length > 0){
            materialInfo =   materialInfo[0];
            var materialCost    =   parseFloat(materialInfo.materialCost);
            //var pp_cost         =   parseFloat(productInfo.final_cost_percentage);
            var printer_rate    =   1;
            var length  =   productInfo.productMinLength;
            var breadth =   productInfo.productMinBreadth;
            var height  =   productInfo.productMinHeight;
            var pack_cost = 0;
            var markup_1    =   0;
            var markup_2    =   0;
            var gst         =   0;
            var discount    =   0;
            var shipping    =   0;
            var designCharge    =   0;

            var packageQuery    =   "select package_cost from packaging_conf where " +
                "min_length >= "+length+" AND max_length <= "+length+" AND " +
                "min_breadth >= "+breadth+" AND max_breadth <= "+breadth+" AND " +
                "min_height >= "+height+" AND max_height <= "+height;

            console.log("COST_MANAGER: ",packageQuery);

            connection.executeQuery(packageQuery,[],function (err, packageCost) {

                if(!err && packageCost != undefined && packageCost != null && packageCost.length >0){
                    pack_cost   =   parseFloat(packageCost[0].package_cost);
                }

                var markupQuery =   "select * from tax_config";
                console.log(markupQuery)
                connection.executeQuery(markupQuery,[],function (err, markups) {
                    if(!err && markups != undefined && markups.length > 0){
                        markup_1    =   parseFloat(markups[0].markup_1);
                        markup_2    =   parseFloat(markups[0].markup_2);
                        gst         =   markups[0].gst_print;
                        gst         =   parseFloat(gst)/100;
                        shipping    =   parseFloat(markups[0].shipping);
                        discount    =   parseFloat(markups[0].discount_print);
                    }
                    Array.prototype.max = function(){
                        return Math.max.apply( Math, this );
                    };

                    var dimension   =   [parseFloat(length),parseFloat(breadth),parseFloat(height)];
                    var maxDimension    =   dimension.max();
                    var printerQuery    =   "select * from printer_dimension where min_dimension >= "+maxDimension+" AND " +
                        "max_dimension <= "+maxDimension+" limit 1";
                    console.log(printerQuery)
                    connection.executeQuery(printerQuery,[],function (err, printVal) {
                        if(!err && printVal != undefined && printVal.length > 0){
                            printer_rate = parseFloat(printVal[0].printer_rate);
                        }
                        var totalMaterialPrice  =   filament*materialCost;
                        var totalPrintPrice     =   print_time*printer_rate
                        var totalPrice          =   totalMaterialPrice+totalPrintPrice+packageCost;

                        productInfo.price   =   totalPrice;
                        callback(productInfo);

                    });
                });

            });

            //callback();
        }else{
            callback();
        }
    })
}

function getAdminProductDetailForCost(productId, curaData, callback) {
    var filament    =   1;
    var print_time  =   1;

    var _filament   =   curaData["Filament used"];
    var _print_time =   curaData["Print time"];
    if(_filament != undefined){
        _filament    =   _filament.trim();
        _filament    =   _filament.replace("m","");
        filament    =   parseFloat(_filament);
    }
    if(_print_time != undefined){
        _print_time =   _print_time.trim();
        _print_time =   parseFloat(_print_time)
        print_time  =   _print_time/60;
    }
    var query   =   "select pr.*,pp.*,mat.* from products as pr " +
        "left join post_process as pp on pp.pk_post_process_id = pr.fk_pp_id " +
        "left join materials as mat on mat.pkMaterialId = pr.def_material where pr.pkProductId = ?";
    connection.executeQuery(query,[productId],function (err, productInfo) {
        console.log(productInfo);
        if(!err && productInfo.length > 0){
            productInfo =   productInfo[0];
            var materialCost    =   parseFloat(productInfo.materialCost);
            var pp_cost         =   parseFloat(productInfo.final_cost_percentage);
            var printer_rate    =   1;
            var length  =   productInfo.minLength;
            var breadth =   productInfo.minBreadth;
            var height  =   productInfo.minHeight;
            var pack_cost = 0;
            var markup_1    =   0;
            var markup_2    =   0;
            var gst         =   0;
            var discount    =   0;
            var shipping    =   0;
            var designCharge    =   0;

            var packageQuery    =   "select package_cost from packaging_conf where " +
                "min_length >= "+length+" AND max_length <= "+length+" AND " +
                "min_breadth >= "+breadth+" AND max_breadth <= "+breadth+" AND " +
                "min_height >= "+height+" AND max_height <= "+height;

            console.log("COST_MANAGER: ",packageQuery);

            connection.executeQuery(packageQuery,[],function (err, packageCost) {

                if(!err && packageCost != undefined && packageCost != null && packageCost.length >0){
                    pack_cost   =   parseFloat(packageCost[0].package_cost);
                }

                var markupQuery =   "select * from tax_config";
                console.log(markupQuery)
                connection.executeQuery(markupQuery,[],function (err, markups) {
                    if(!err && markups != undefined && markups.length > 0){
                        markup_1    =   parseFloat(markups[0].markup_1);
                        markup_2    =   parseFloat(markups[0].markup_2);
                        gst         =   markups[0].gst_print;
                        gst         =   parseFloat(gst)/100;
                        shipping    =   parseFloat(markups[0].shipping);
                        discount    =   parseFloat(markups[0].discount_print);
                    }
                    Array.prototype.max = function(){
                        return Math.max.apply( Math, this );
                    };

                    var dimension   =   [parseFloat(length),parseFloat(breadth),parseFloat(height)];
                    var maxDimension    =   dimension.max();
                    var printerQuery    =   "select * from printer_dimension where min_dimension >= "+maxDimension+" AND " +
                        "max_dimension <= "+maxDimension+" limit 1";
                    console.log(printerQuery)
                    connection.executeQuery(printerQuery,[],function (err, printVal) {
                        if(!err && printVal != undefined && printVal.length > 0){
                            printer_rate = parseFloat(printVal[0].printer_rate);
                        }
                        var totalMaterialPrice  =   filament*materialCost;
                        var totalPrintPrice     =   print_time*printer_rate
                        var totalPrice          =   totalMaterialPrice+totalPrintPrice+packageCost;
                        var obj =   {
                            minPrice:totalPrice
                        };
                        console.log("Updating Price: ",obj);
                        var updateQuery = "update products set ? where pkProductId = ?";
                        connection.executeQuery(updateQuery,[obj,productId],function (err, stat) {

                            callback();
                        })

                    })



                });

            });

            //callback();
        }else{
            callback();
        }
    })
}
exports.calculateAdminProductCost   =   function (productInfo) {
    console.log("Hit_Cost_Manager")
    getSTLDataQueue.add({productInfo:productInfo});
}

exports.calculateUserProductCost    =   function (productInfo, callback) {
    //getUserSTLDataQueue.add({productInfo:productInfo});

    processSTL("",productInfo.stlFile,false,function (obj) {
        getUserProductDetailForCost(productInfo,obj,function (productData) {
            console.log(productData);
            callback(productData);
        })

    })
}