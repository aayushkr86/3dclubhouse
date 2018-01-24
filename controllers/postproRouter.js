/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var loginValidator  =   require('../utils/loginValidator');
var postProManager =   require('../businessLayer/postProBA');

router.get('/getallpostpro',loginValidator.isAdminLoggedIn,function (req, res) {
    postProManager.getAllPostPro(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getpostprofromid',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.pk_post_process_id) {
        postProManager.getPostProFromId(req.body.pk_post_process_id, function (err, categories) {
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

router.post('/getpostprofrommaterial',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.fk_material_id) {
        postProManager.getPostProOfMaterial(req.body.fk_material_id, function (err, categories) {
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

router.post('/addpostpro',loginValidator.isAdminLoggedIn,function (req, res) {
   if(req.body.process_name){
       postProManager.addPostPro(req.body,function (err, categories) {
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

router.post('/updatepostpro',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.pk_post_process_id){
        postProManager.updatePostPro(req.body,function (err, categories) {
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