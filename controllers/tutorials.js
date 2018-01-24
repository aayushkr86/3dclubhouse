/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var tutorialManager =   require('../businessLayer/tutorialBA');

var multer  = require('multer');
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var multerS3 = require('multer-s3');
var s3 = new aws.S3({ /* ... */});

var hashedImageName = "imageName";
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
        var fullPath = 'tutorials/'+ hashedImageName;
        cb(null, fullPath)
    }
});


var upload = multer({ storage: storage});
router.post('/uploadtutorials', upload.array('uploadfile'), function (req, res, next) {
    var files   =   [];
    for(var i=0;i<req.files.length;i++){
        files.push(req.files[i].location)
    }
    res.send(files);

})


router.get('/getalltutorials',function (req, res) {
    tutorialManager.getAllTutorials(function (err, tutorials) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,tutorials);
        }
    });
});

router.get('/getalltutorialswithmedia',function (req, res) {
    tutorialManager.getAllTutorialsWithMedia(function (err, tutorials) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,tutorials);
        }
    });
});

router.post('/gettutorialfromid',function (req, res) {
    if(req.body.pkTutorialId) {
        tutorialManager.getTutorialFromId(req.body.pkTutorialId, function (err, tutorials) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, tutorials);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/addtutorial',function (req, res) {
   if(req.body.tutorialTitle){
       tutorialManager.addTutorial(req.body,function (err, tutorials) {
           if(err){
               req.response.sendErrorResponse(req,err);
           }else{
               //tutorials   =   JSON.stringify(tutorials);
               req.response.sendSuccessResponse(req,tutorials);
           }
       });
   }else{
       req.response.sendErrorResponse(req,"Invalid Payload");
   }
});

router.post('/updatetutorial',function (req, res) {
    if(req.body.pkTutorialId){
        tutorialManager.updateTutorial(req.body,function (err, tutorials) {
            if(err){
                req.response.sendErrorResponse(req,err);
            }else{
                //tutorials   =   JSON.stringify(tutorials);
                req.response.sendSuccessResponse(req,tutorials);
            }
        });
    }else{
        req.response.sendErrorResponse(req,"Invalid Payload");
    }
});

module.exports  =   router;