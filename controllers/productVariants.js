/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var productVariantManager =   require('../businessLayer/productVariantBA');


router.post('/getvariantsfromproductid',function (req, res) {
    if(req.body.fkProductId) {
        productVariantManager.getVariantsOfProductId(req.body.fkProductId, function (err, variants) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, variants);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/updatevariant',function (req, res) {
    if(req.body.fkProductId && req.body.pkProductVariantId) {
        productVariantManager.updateVariant(req.body, function (err, variants) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, variants);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/addvariant',function (req, res) {
    if(req.body.fkProductId) {
        productVariantManager.addVariant(req.body,function (err, variantStat) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, variantStat);
            }
        })
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

module.exports  =   router;