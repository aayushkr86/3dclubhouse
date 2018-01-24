/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var categoryManager =   require('../businessLayer/categoryBA');

var multer  = require('multer');
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var multerS3 = require('multer-s3')
var s3 = new aws.S3({ /* ... */})

var done = false;
var onLimit = false;
var hashedImageName = "imageName";
var passwordHash = require('password-hash');
var fs  =   require('fs');
var path = require('path');

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
        var fullPath = 'categories/'+ hashedImageName;
        cb(null, fullPath)
    }
})


var upload = multer({ storage: storage});
router.post('/uploadcategoryimage', upload.single('uploadfile'), function (req, res, next) {
    console.log(req.file);
    res.send(req.file.location)

})



router.get('/getallcategories',function (req, res) {
    categoryManager.getAllCategories(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getcategoryfromid',function (req, res) {
    if(req.body.categoryId) {
        categoryManager.getAllCategoriesFromId(req.body.categoryId, function (err, categories) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, categories);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/addcategory',function (req, res) {
   if(req.body.categoryName){
       categoryManager.addCategory(req.body,function (err, categories) {
           if(err){
               req.response.sendErrorResponse(req,categories,[err]);
           }else{
               //categories   =   JSON.stringify(categories);
               req.response.sendSuccessResponse(req,categories);
           }
       });
   }else{
       req.response.sendErrorResponse(req,"Invalid Payload");
   }
});
router.post('/updatecategory',function (req, res) {
    if(req.body.pkCategoryId){
        categoryManager.updateCategory(req.body,function (err, categories) {
            if(err){
                req.response.sendErrorResponse(req,categories,[err]);
            }else{
                //categories   =   JSON.stringify(categories);
                req.response.sendSuccessResponse(req,categories);
            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});

router.post('/deletecategory',function (req, res) {
    if(req.body.pkCategoryId){
        categoryManager.deleteCategory(req.body,function (err, categories) {
            if(err){
                req.response.sendErrorResponse(req,categories,[err]);
            }else{
                //categories   =   JSON.stringify(categories);
                req.response.sendSuccessResponse(req,categories);
            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});



module.exports  =   router;