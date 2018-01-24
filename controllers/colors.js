/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var colorManager =   require('../businessLayer/colorBA');

router.get('/getallcolors',function (req, res) {
    colorManager.getAllColors(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getcolorfromid',function (req, res) {
    if(req.body.colorId) {
        colorManager.getColorFromId(req.body.colorId, function (err, categories) {
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


router.post('/getcolorsofmaterial',function (req, res) {
    if(req.body.materialId) {
        colorManager.getColorsOfMaterial(req.body.materialId, function (err, categories) {
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

router.post('/addcolor',function (req, res) {
   if(req.body.colorName){
       colorManager.addColor(req.body,function (err, categories) {
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

router.post('/updatecolor',function (req, res) {
    if(req.body.pkColorId){
        colorManager.updateColor(req.body,function (err, categories) {
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