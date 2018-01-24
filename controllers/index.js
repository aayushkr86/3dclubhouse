var express = require('express');
var router = express.Router();
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('main/index.html', { title: 'Express' });
// });


// router.get('/testheader',function (req, res) {
//     res.render('admin/adminheader.html')
// });

// router.get("/test",function (req, res) {
//     res.send("Todo Test")
// });
//
// router.post('/create',function (req, res) {
//     connection.executeQuery("insert into todo set ?",req.body,function (err, data) {
//         res.send(data);
//     })
// })

// router.get('/v2/analyze_stl',function (req, res) {
//     var shell = require('shelljs');
//     var command = 'CuraEngine slice -v -j ../../../poc/Cura/resources/definitions/fdmprinter.def.json -o "test.gcode" -e0 -s infill_line_distance=0 -e0 -l "../trouser_clip.stl"'
//     var child = shell.exec(command, {async:true});
//     child.stdout.on('data', function(data) {
//         console.log("NodeJS Version: ",data)
//         res.send(data);
//     });
// });

var shipRocket = require('../dataAccessLayer/shipRocketManager')
router.get('/v2/shiprocket',shipRocket.isTokenValid,function (req, res) {
    shipRocket.placeOrder();
})


router.get('/v2/fs/download',function (req, res) {
    var fs  =   require('fs');
    var download    =   require('download-to-file');
    // download("https://3dclubhouse.s3.amazonaws.com/products/1508520532106_medaillon5elements.STL").then(function (data) {
    //     console.log("Received Data. Beginning File Write");
    //     fs.writeFileSync('temp_stl/test.stl', data);
    //     console.log("Written to file");
    // })

    download('https://3dclubhouse.s3.amazonaws.com/products/1508520532106_medaillon5elements.STL', 'temp_stl/example.stl', function (err) {
        if (err) throw err
        console.log('Download finished');


        //STL Operation
        var shell = require('shelljs');
        var command = '/home/ubuntu/poc/CuraEngine/build/CuraEngine slice -v -j /home/ubuntu/poc/Cura/resources/definitions/json.def.json -o "test.gcode" -e0 -s infill_line_distance=0 -e0 -l "/home/ubuntu/pro/3dclubhouse/trouser_clip.stl"'
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
                var lastObj = splitter[splitter.length-1];
                lastObj = lastObj.split("\n").map(function (t) {
                    return t.replace(";","");
                });
                for(var k=0;k<lastObj.length;k++){
                    var each = lastObj[k];
                    each    =   each.replace(";","");
                    var splitObj = each.split(":");
                    if(splitObj.length == 2){
                        obj[splitObj[0]] = splitObj[1];
                    }
                }
                //obj.lastObj = lastObj;
                res.send((obj));
            });
        });
    })
})

router.get('/v2/analyze_stl',function (req, res) {
    var shell = require('shelljs');
    var command = '/home/ubuntu/poc/CuraEngine/build/CuraEngine slice -v -j /home/ubuntu/poc/Cura/resources/definitions/json.def.json -o "test.gcode" -e0 -s infill_line_distance=0 -e0 -l "/home/ubuntu/pro/3dclubhouse/trouser_clip.stl"'
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
        var finalData = resp.replace(/\\/g, "");
        //finalData   =   JSON.parse(finalData);
        res.send(finalData);
    })
    // child.stdout.on('data', function(data) {
    //     console.log("NodeJS Version: ",data)
    //     res.send(data);
    // });
});

module.exports = router;