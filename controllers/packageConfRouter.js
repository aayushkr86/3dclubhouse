/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var loginValidator  =   require('../utils/loginValidator');
var packageConfManager =   require('../businessLayer/packageConfBA');

router.get('/getallpackageconf',loginValidator.isAdminLoggedIn,function (req, res) {
    packageConfManager.getAllPackageConf(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getpackageconffromid',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.pk_package_conf_id) {
        packageConfManager.getPackageConfFromId(req.body.pk_package_conf_id, function (err, categories) {
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

router.post('/addpackageconf',loginValidator.isAdminLoggedIn,function (req, res) {
   if(req.body.package_cost){
       packageConfManager.addPackageConf(req.body,function (err, categories) {
           if(err){
               req.response.sendErrorResponse(req,err);
           }else{
               //categories   =   JSON.stringify(categories);
               req.response.sendSuccessResponse(req,categories);
           }
       });
   }else{
       req.response.sendErrorResponse(req,"Invalid Payload");
   }
});

router.post('/updatepackageconf',loginValidator.isAdminLoggedIn,function (req, res) {
    console.log(res.body);
    if(req.body.pk_package_conf_id){
        packageConfManager.updatePackageConf(req.body,function (err, categories) {
            if(err){
                req.response.sendErrorResponse(req,err);
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