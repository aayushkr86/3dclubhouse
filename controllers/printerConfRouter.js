/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var loginValidator  =   require('../utils/loginValidator');
var printConfManager =   require('../businessLayer/printerConfBA');

router.get('/getallprintconf',loginValidator.isAdminLoggedIn,function (req, res) {
    printConfManager.getAllPrinterConf(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getprintconffromid',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.pk_printer_dim_id) {
        printConfManager.getPrinterConfFromId(req.body.pk_printer_dim_id, function (err, categories) {
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

router.post('/addprintconf',loginValidator.isAdminLoggedIn,function (req, res) {
   if(req.body.printer_code){
       printConfManager.addPrinterConf(req.body,function (err, categories) {
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

router.post('/updateprintconf',loginValidator.isAdminLoggedIn,function (req, res) {
    console.log(res.body);
    if(req.body.pk_printer_dim_id){
        printConfManager.updatePrinterConf(req.body,function (err, categories) {
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