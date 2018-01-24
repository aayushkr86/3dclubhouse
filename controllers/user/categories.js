/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var categoryManager =   require('../../businessLayer/categoryBA');
var productManager =   require('../../businessLayer/productBA');




router.get('/getallcategories',function (req, res) {
    categoryManager.getAllCategories(function (err, categories) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,categories);
        }
    });
});

router.post('/getcategoryfromid',function (req, res) {
    if(req.body.categoryId) {
        categoryManager.getAllCategoriesFromId(req.body.categoryId, function (err, categories) {
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

router.post('/getrecentproductsoncat',function (req, res) {
    productManager.getRecentProductsFromCategory(req.body.categoryId,function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});



module.exports  =   router;