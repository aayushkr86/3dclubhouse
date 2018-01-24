var express = require('express');
var router = express.Router();
var loginValidator  = require('../utils/loginValidator')
var landingImgManager = require('../businessLayer/landingImgsBA');
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
        var fullPath = 'landingpage/'+ hashedImageName;
        cb(null, fullPath)
    }
})

var upload = multer({ storage: storage});
router.post('/uploadlandingimg', upload.array('uploadfile'),function (req, res) {
    console.log(req.files);
    var files   =   [];
    for(var i=0;i<req.files.length;i++){
        files.push(req.files[i].location)
    }

    var async  = require('async');
    async.eachSeries(files,function (img, finish) {
        landingImgManager.addLandingImage(img,function (err, stat) {
            finish();
        })
    },function (done) {
        res.send(files);
    });


});

router.get('/getlandingimages',function (req, res) {
    landingImgManager.getAllLandingImgs(function (err, imgs) {
        res.send(imgs);
    })
});

router.post('/deletelandingimages',loginValidator.isAdminLoggedIn,function (req, res) {
    console.log(req.body);
   var ids = JSON.parse(req.body.deleteIds);
   console.log(ids);
    landingImgManager.deleteImages(ids,function (err, stat) {
       res.send(stat);
    });
});


module.exports =  router;