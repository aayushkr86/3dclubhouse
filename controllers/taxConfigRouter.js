/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var loginValidator  =   require('../utils/loginValidator');
var taxConfManager =   require('../businessLayer/taxConfigBA');

router.get('/getalltaxconf',loginValidator.isAdminLoggedIn,function (req, res) {
    taxConfManager.getAllTaxConf(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});



router.post('/addtaxconf',loginValidator.isAdminLoggedIn,function (req, res) {
   if(req.body.markup_1){
       taxConfManager.addTaxConf(req.body,function (err, categories) {
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