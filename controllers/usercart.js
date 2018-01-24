/**
 * Created by anooj on 06/05/17.
 */
var express = require('express');
var router = express.Router();
var productManager =   require('../businessLayer/userCartBA');
var loginValidator  =   require('../utils/loginValidator');
var studentManager  = require('../businessLayer/studentUserBA');
var cartManager =   require('../businessLayer/userCartBA');
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var multerS3 = require('multer-s3')
var s3 = new aws.S3({ /* ... */})
var host  = ""
if(process.env.RUNNING_HOST == 0){
    host  = "http://localhost:3000/"
}else{
    host  = "http://34.202.5.62/"
}
var multer  = require('multer');
var done = false;
var onLimit = false;
var hashedImageName = "imageName";
var passwordHash = require('password-hash');
var fs  =   require('fs');
var path = require('path');


router.post('/getusercart',loginValidator.isUseLoggedIn,function (req, res) {
    req.body.fkUserId = req.userId;
    productManager.getTotalCart(req.userId, function (err, products) {
        if (err) {
            req.response.sendErrorResponse(req, err);
        } else {
            req.response.sendSuccessResponse(req, products);
        }
    });
});

router.post('/addtocart',loginValidator.isUseLoggedIn,function (req, res) {
    req.body.fkUserId   =   req.userId;
    if(req.body.fkProductId && req.body.quantity) {
        productManager.addToCart(req.body, function (err, products) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, products);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/addtocartbulk',function (req, res) {
    productManager.addToCartBulk(req.body,function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,products,[err]);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});

router.post('/updatecart',function (req, res) {
    productManager.updateCart(req.body,function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});

router.post('/removecart',loginValidator.isUseLoggedIn,function (req, res) {
    productManager.removeCart(req.body.pkUserCartId,req.userId,function (err, products) {
        if(err){
            req.response.sendErrorResponse(req,err);
        }else{
            req.response.sendSuccessResponse(req,products);
        }
    });
});

router.post('/addtowishlist',loginValidator.isUseLoggedIn,function (req, res) {
    if(req.body.productId && req.userId) {
        req.body.userId =   req.userId;
        productManager.addToWishlist(req.body, function (err, products) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, products);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.get('/getmywishlist',loginValidator.isUseLoggedIn,function (req, res) {
    if(req.userId) {
        productManager.getMyWishlist(req.userId, function (err, wishes) {
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, wishes);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});


router.post('/removefromwishlist',loginValidator.isUseLoggedIn,function (req, res) {
    if(req.body.productId) {
        cartManager.removeFromWishlist(req.body.productId, req.userId, function (err, wishes) {
            console.log("Err")
            console.log(err);
            if (err) {
                req.response.sendErrorResponse(req, err);
            } else {
                req.response.sendSuccessResponse(req, wishes);
            }
        });
    }else{
        req.response.sendErrorResponse(req, "Invalid Payload");
    }
});

router.post('/applycoupon',function (req, res) {
    if(req.body.couponName) {
        var couponManager = require('../businessLayer/productBA');
        couponManager.getCouponFromName(req.body.couponName, req.userId, function (err, couponInfo) {
            if(couponInfo != undefined && couponInfo.length != undefined && couponInfo.length > 0){
                req.response.sendSuccessResponse(req, couponInfo[0]);
            }else{
                req.response.sendErrorResponse(req, false);
            }
        })
    }
});

router.post('/applycoupon/registration',function (req, res) {
    if(req.body.couponName) {
        var couponManager = require('../businessLayer/productBA');
        couponManager.getCouponFromNameForReg(req.body.couponName, function (err, couponInfo) {
            if(couponInfo != undefined && couponInfo.length != undefined && couponInfo.length > 0){
                req.response.sendSuccessResponse(req, couponInfo[0]);
            }else{
                req.response.sendErrorResponse(req, false);
            }
        })
    }
});

router.get('/getallmyorders',loginValidator.isUseLoggedIn,function (req, res) {
    productManager.getMyOrders(req.userId,function (err, orders) {
        if(orders != undefined && orders.length != undefined && orders.length > 0){
            req.response.sendSuccessResponse(req, orders);
        }else{
            req.response.sendErrorResponse(req, false);
        }
    })
})

module.exports  =   router;