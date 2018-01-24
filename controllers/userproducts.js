/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var productManager =   require('../businessLayer/productBA');
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var multerS3 = require('multer-s3')
var s3 = new aws.S3({ /* ... */})

var multer  = require('multer');
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
        var fullPath = 'userproducts/'+ hashedImageName;
        cb(null, fullPath)
    }
})


var upload = multer({ storage: storage});
router.post('/uploaduserproduct', upload.array('uploadfile'), function (req, res, next) {
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



router.get('/getallproducts',function (req, res) {
    productManager.getAllProducts(function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});



module.exports  =   router;