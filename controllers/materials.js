/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var loginValidator  =   require('../utils/loginValidator');
var materialManager =   require('../businessLayer/materialBA');

router.get('/getallmaterials',function (req, res) {
    materialManager.getAllMaterials(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getmaterialfromid',function (req, res) {
    if(req.body.materialId) {
        materialManager.getMaterialsFromId(req.body.materialId, function (err, categories) {
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

router.post('/addmaterial',loginValidator.isAdminLoggedIn,function (req, res) {
   if(req.body.materialName){
       materialManager.addMaterial(req.body,function (err, categories) {
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

router.post('/updatematerial',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.pkMaterialId){
        materialManager.updateMaterial(req.body,function (err, categories) {
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

router.post('/updatebasematerial',loginValidator.isAdminLoggedIn,function (req, res) {
    if(req.body.baseMaterialId){
        materialManager.updateBaseMaterial(req.body,function (err, categories) {
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

router.get('/getallnonbasematerials',function (req, res) {
    materialManager.getAllNonBaseMaterials(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/addmaterialcostmgmt',loginValidator.isAdminLoggedIn,function (req, res) {
    materialManager.addMaterialCostMgmt(req.body,function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});
router.get('/getmaterialcostmgmt',function (req, res) {
    materialManager.getMaterialCostMgmt(function (err, costStatus) {
        if(err){
            req.response.sendErrorResponse(req,costStatus);
        }else{
            req.response.sendSuccessResponse(req,costStatus);
        }
    })
})

module.exports  =   router;