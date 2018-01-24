var express = require('express');
var router = express.Router();
var loginValidator  = require('../utils/loginValidator')
var homeImgManager = require('../businessLayer/homeImgsBA');
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
        var fullPath = 'homepage/'+ hashedImageName;
        cb(null, fullPath)
    }
})

var upload = multer({ storage: storage});
router.post('/uploadteamimage', upload.array('uploadfile'),function (req, res) {
    console.log(req.files);
    var files   =   [];
    for(var i=0;i<req.files.length;i++){
        files.push(req.files[i].location)
    }

    var async  = require('async');
    async.eachSeries(files,function (img, finish) {
        homeImgManager.addHomeImage(img,function (err, stat) {
            finish();
        })
    },function (done) {
        res.send(files);
    });


});

router.get('/getteaminfo',function (req, res) {
    homeImgManager.getAllHomeImgs(function (err, imgs) {
        res.send(imgs);
    })
});

router.post('/deletemember',loginValidator.isAdminLoggedIn,function (req, res) {
    console.log(req.body);
   var ids = JSON.parse(req.body.deleteIds);
   console.log(ids);
    homeImgManager.deleteImages(ids,function (err, stat) {
       res.send(stat);
    });
});


module.exports =  router;