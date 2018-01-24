/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var productManager =   require('../businessLayer/productBA');
var cartManager =   require('../businessLayer/userCartBA');
var loginValidator  = require('../utils/loginValidator')
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var multerS3 = require('multer-s3')
var s3 = new aws.S3({ /* ... */});
var redis = require("redis"),
    redisClient = redis.createClient();

var multer  = require('multer');
var done = false;
var onLimit = false;
var hashedImageName = "imageName";
var passwordHash = require('password-hash');
var fs  =   require('fs');
var path = require('path');
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/admin/upload/products/')
//     },
//     filename: function (req, file, cb) {
//         hashedImageName = passwordHash.generate(Date.now()+"_"+file.filename + file.fieldname);
//         cb(null, hashedImageName+path.extname(file.originalname))
//     }
// });

var intermediateStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp_stl')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

var storage =   multerS3({
    s3: s3,
    bucket: '3dclubhouse',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        hashedImageName = (Date.now()+"_"+file.originalname);
        hashedImageName.trim();
        hashedImageName = hashedImageName.replace(/\s+/g, '');
        hashedImageName =   hashedImageName.replace('$','1');
        var fullPath = 'products/'+ hashedImageName;
        cb(null, fullPath)
    }
})

var storageUserProduct =   multerS3({
    s3: s3,
    bucket: '3dclubhouse',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        hashedImageName = (Date.now()+"_"+file.originalname);
        hashedImageName.trim();
        hashedImageName = hashedImageName.replace(/\s+/g, '');
        hashedImageName =   hashedImageName.replace('$','1');
        var fullPath = 'products/'+ hashedImageName;
        cb(null, fullPath)
    }
})


var upload = multer({ storage: storage});
router.post('/uploadproductimages', upload.array('uploadfile'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log("Files : ",req.files);
    //console.log(req.file.filename);
    //res.send("/admin/upload/products/"+req.file.filename)
    var files   =   [];
    for(var i=0;i<req.files.length;i++){
        files.push(req.files[i].location)

    }


    res.send(files);

})

var uploadUserProduct = multer({ storage: storageUserProduct});
router.post('/uploaduserproductimages', uploadUserProduct.array('uploadfile'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log("Files : ",req.files);
    //console.log(req.file.filename);
    //res.send("/admin/upload/products/"+req.file.filename)
    var files   =   [];
    for(var i=0;i<req.files.length;i++){
        files.push(req.files[i].location)
    }
    res.send(files);

});

router.post('/uploadtempuserproduct',loginValidator.isUseLoggedIn,function (req, res) {
    var files   =   [];
    var hasSTL  =   false;
    var stlFileName =   "";
    var fileNames   =   [];
    var uniqueId    =   "club_"+Date.now();
    var productInfo   =   req.body;
    var pr_stls =   JSON.parse(productInfo.files);
    for(var i=0;i<pr_stls.length;i++){
        files.push(pr_stls[i]);
        fileNames.push(pr_stls[i]);
        if(pr_stls[i].indexOf("stl") != -1 || pr_stls[i].indexOf("STL") != -1){
            hasSTL  =   true;
            stlFileName =   pr_stls[i];
        }
    }
    if(hasSTL){
        uniqueId    =   "club_"+Date.now();

        productInfo.productImages = fileNames;
        productInfo.stlFile = stlFileName;
        var savedProduct    =   {
            productInfo:productInfo,
            uploaded:fileNames
        };


        var costManager =   require('../dataAccessLayer/costManagerDA');
        costManager.calculateUserProductCost(productInfo,function (productData) {
            productData.uniqueId    =   uniqueId;
            console.log(productData);
            redisClient.set(uniqueId,JSON.stringify(productData));
            res.send(productData);
        });

//


    }else{
        var fs = require('fs');
        var async   =   require('async');
        async.eachSeries(pr_stls,function (file, done) {
            var name    =   file;
            fs.unlink('/home/ubuntu/pro/3dclubhouse/temp_stl/' + name + '.stl', function (errr, statss) {
                console.log("File Unlinked");
                //callback(obj);
                done();
            });
        },function (err) {
            res.send(false);
        });
    }
})

router.post('/confirmdesignorder',loginValidator.isUseLoggedIn,function (req, res) {
   var orderDetails =   req.body;
   if(orderDetails.uniqueId){
        var uniqueId =   orderDetails.uniqueId;
        var productInfo =   orderDetails;
        redisClient.get(uniqueId,function (err, product) {
            productInfo =   product;
        })
        console.log("REDIS_DATA: ",productInfo);
        productInfo.fkUserId = req.userId;
        if(productInfo != null) {
            //productInfo = JSON.parse(productInfo);
            console.log(productInfo);
            //Upload Image
            var files   =   productInfo.files;
            files   =   JSON.parse(files);
            var uploaded    =   [];
            var async   =   require('async');
            var s3Manager   =   require('../businessLayer/S3Management');
            async.eachSeries(files,function (file, done) {

                s3Manager.uploadToS3FromLocal(file,function (err,data) {
                    if(!err){
                        uploaded.push("https://3dclubhouse.s3.amazonaws.com/products/"+file);
                    }
                    done();
                })

            },function (err) {
                if(uploaded.length > 0){
                    productManager.addUserProduct(productInfo,function (err, data) {
                        console.log("Add_USER_PRO: ",data);
                        productInfo = JSON.parse(productInfo)
                        if(!err && data != undefined && data != null && data.productStat != undefined){
                            productInfo.productId   =   data.productStat.insertId;
                        }

                        //ADD ORDER
                        var orderGroupId  = new Date().getTime();
                        var orderInfo   =   {};

                        orderInfo.fkUserId = req.userId;
                        orderInfo.pkUserId = req.userId;
                        orderInfo.fkProductId = productInfo.productId;
                        orderInfo.fkColorId = productInfo.productColor;
                        orderInfo.fkMaterialId  =   productInfo.productMaterialId;
                        orderInfo.height =    productInfo.productMinHeight;
                        orderInfo.length =    productInfo.productMinLength;
                        orderInfo.breadth =   productInfo.productMinBreadth;
                        orderInfo.quality =   productInfo.productQuality;
                        orderInfo.strength = productInfo.productStrength;
                        orderInfo.quantity = parseInt(orderDetails.quantity);
                        orderInfo.calculatedPrice = parseFloat(orderDetails.price);


                        placeDesignOrder(orderInfo,orderGroupId,function (err, ord) {
                            console.log("PDORD: ",ord)
                            res.send(true);
                        });

                    })
                }else{
                    res.send(false);
                }
            })

        }else{
            res.send(false)
        }
   }

});

function placeDesignOrder(orderInfo, groupId, callback) {
    console.log("PLACE: ",orderInfo);
    var calculatedTotalPrice = (parseFloat(orderInfo.calculatedPrice)*parseInt(orderInfo.quantity))

    cartManager.addOrder([orderInfo],groupId,function (err, stat) {
        if(!err){
            orderInfo.actualAmount = calculatedTotalPrice;
            cartManager.addToOrderGroup(orderInfo,groupId,function (err, grpStat) {
                //cartManager.removeAllCart(orderInfo.pkUserId,function (err, removeData) {
                    callback(err,grpStat);
                //});
            })
        }else{
            callback(false,stat);
        }

    })
}

var uploadTempUserProduct = multer({ storage: intermediateStorage});
router.post('/uploadtempuserproductimages', uploadTempUserProduct.array('uploadfile'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log("Files : ",req.files)
    //console.log("BODY_FIL: ",req.body);
    //console.log(req.file.filename);
    //res.send("/admin/upload/products/"+req.file.filename)
    var files   =   [];
    for(var i=0;i<req.files.length;i++){
        // if(req.files[i].originalname.indexOf("stl") != -1 || (req.files[i].originalname.indexOf("STL") != -1)){
        //     files.push(req.files[i].filename)
        // }else{
            files.push(req.files[i].filename)
        //}
    }
    res.send(files);
    //res.send(files);

});


router.get('/getallproducts',function (req, res) {
    productManager.getAllProducts(function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});


router.get('/getrecentproducts',function (req, res) {
    productManager.getRecentProducts(function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});

router.post('/getproductfromid',function (req, res) {
    if(req.body.fkProductId) {
        productManager.getProductsFromId(req.body.fkProductId, function (err, products) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, products);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/addproduct',function (req, res) {
    console.log(req.body)
   if(req.body.productName){
       productManager.addProduct(req.body,{},function (err, categories) {
           if(err){
               req.response.sendErrorResponse(req,err);
           }else{
               req.response.sendSuccessResponse(req,categories);
           }
       });
   }else{
       req.response.sendErrorResponse(req,"Invalid Payload");
   }
});

router.post('/adduserproduct', loginValidator.isUseLoggedIn, function (req, res) {
    console.log(req.body)
    if(req.body.productName){
        var productAllInfo  =   req.body;
        var productInfo         =   req.body;
        //delete productInfo["price"];
        //delete productInfo["quality"]
        //delete productInfo["quantity"]
        productInfo.fkUserId = req.userId;
        productInfo.height = productInfo.productMinHeight
        productInfo.breadth = productInfo.productMinBreadth
        productInfo.length = productInfo.productMinLength
        productManager.addUserProduct(productInfo,function (err, categories) {
            console.log("After: ",categories)
            if(err && categories.productStat != undefined){
                req.response.sendErrorResponse(req,err);
            }else{
                productInfo.fkProductId =   categories.productStat.insertId;
                cartManager.addToCart(productInfo,function (err, cartStat) {
                    req.response.sendSuccessResponse(req,categories);
                })

            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});

router.post('/adddoodleproduct',loginValidator.isUseLoggedIn,function (req, res) {
    var productInfo         =   req.body;
    productInfo.fkUserId = req.userId;
    console.log(productInfo)
    productInfo.productImages   =   JSON.parse(productInfo.files);

    productManager.addUserDoodleProduct(productInfo,function (err, categories) {
        console.log("After: ",categories)
        if(err && categories.productStat != undefined){
            req.response.sendErrorResponse(req,err);
        }else{
            productInfo.productId =   categories.productStat.insertId;


            var orderGroupId  = new Date().getTime();
            var orderInfo   =   {};

            orderInfo.fkUserId = req.userId;
            orderInfo.pkUserId = req.userId;
            orderInfo.fkProductId = productInfo.productId;
            orderInfo.height =    0;
            orderInfo.length =    0;
            orderInfo.breadth =   0;
            orderInfo.quality =   0;
            orderInfo.strength = 0;
            orderInfo.quantity = parseInt(productInfo.quantity);
            orderInfo.calculatedPrice = parseFloat(productInfo.price);


            placeDesignOrder(orderInfo,orderGroupId,function (err, ord) {
                console.log("PDORD: ",ord)
                res.send(true);
            });
        }
    });
})

router.post('/updateuserproduct',function (req, res) {
    console.log(req.body);
    //req.body    =   JSON.stringify(req.body);
    //req.body    =   JSON.parse(req.body);
    console.log(req.body);
    if(req.body.pkProductId){
        productManager.updateProduct(req.body,function (err, categories) {
            if(err){
                req.response.sendErrorResponse(req,err);
            }else{
                req.response.sendSuccessResponse(req,categories);
            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});

router.post('/updateproduct',function (req, res) {
    console.log(req.body);
    //req.body    =   JSON.stringify(req.body);
    //req.body    =   JSON.parse(req.body);
    console.log(req.body);
    if(req.body.pkProductId){
        productManager.updateProduct(req.body,function (err, categories) {
            if(err){
                req.response.sendErrorResponse(req,err);
            }else{
                req.response.sendSuccessResponse(req,categories);
            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});

router.post('/deleteproduct',function (req, res) {
    console.log(req.body)
    if(req.body.pkProductId){
        productManager.deleteProduct(req.body.pkProductId,function (err, categories) {
            if(err){
                req.response.sendErrorResponse(req,err);
            }else{
                req.response.sendSuccessResponse(req,categories);
            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});

router.get('/getproductsofallcategory/:eachlimit',function (req, res) {
    var eachLimit   =   req.params.eachlimit ? req.params.eachlimit:5;
    productManager.getProductsFromAllCategory(eachLimit,function (err, products) {
        
    });
});

router.post('/createcoupon',function (req, res) {
    productManager.createCoupon(req.body,function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
})

router.post('/updatecoupon',function (req, res) {
    productManager.updateCoupon(req.body,function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
})

router.get('/getcoupons',function (req, res) {
    productManager.getCoupons(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});



router.post('/createfaq',function (req, res) {
    productManager.createFAQ(req.body,function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
})

router.post('/updatefaq',function (req, res) {
    productManager.updateFAQ(req.body,function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
})

router.get('/getfaqs',function (req, res) {
    productManager.getFAQs(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
})
module.exports  =   router;