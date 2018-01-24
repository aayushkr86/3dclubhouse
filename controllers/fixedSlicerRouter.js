/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var loginValidator  =   require('../utils/loginValidator');
var fixedSlicerManager =   require('../businessLayer/fixedSlicerBA');

router.get('/getallfixedslicer',loginValidator.isAdminLoggedIn,function (req, res) {
    fixedSlicerManager.getAllFixedSlicer(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getfixedslicerfromid',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.pk_fixed_id) {
        fixedSlicerManager.getFixedSlicerFromId(req.body.pk_fixed_id, function (err, categories) {
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

router.post('/addfixedslicer',loginValidator.isAdminLoggedIn,function (req, res) {
   if(req.body.variable_code){
       fixedSlicerManager.addFixedSlicer(req.body,function (err, categories) {
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

router.post('/updatefixedslicer',loginValidator.isAdminLoggedIn,function (req, res) {
    console.log(res.body);
    if(req.body.pk_fixed_id){
        fixedSlicerManager.updateFixedSlicer(req.body,function (err, categories) {
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