/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var doodleManager =   require('../businessLayer/doodlePriceBA');

router.get('/getalldoodleprices',function (req, res) {
    doodleManager.getAllDoodlePrices(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getdoodlepricefromid',function (req, res) {
    if(req.body.pk_doodle_price_id) {
        doodleManager.getDoodlePriceFromId(req.body.pk_doodle_price_id, function (err, categories) {
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



router.post('/adddoodleprice',function (req, res) {
   if(req.body.price){
       doodleManager.addDoodlePrice(req.body,function (err, categories) {
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

router.post('/updatedoodleprice',function (req, res) {
    if(req.body.pk_doodle_price_id){
        doodleManager.updateDoodlePrice(req.body,function (err, categories) {
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