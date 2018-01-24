
var productManager =   require('../dataAccessLayer/productDA');
var productVariantManager   =   require('../businessLayer/productVariantBA');
var categoryManager     =   require('../businessLayer/categoryBA');
var fixedSlicerManager  =   require('../businessLayer/fixedSlicerBA');
var cartManager         =   require('../businessLayer/userCartBA');
var materialManager     =   require('../businessLayer/materialBA');

exports.getAllProducts    =   function (callback) {
    productManager.getAllProducts(function (err, products) {
        callback(err,products);
    })
};

exports.getRecentProducts    =   function (callback) {
    productManager.getRecentProducts(function (err, products) {
        callback(err,products);
    })
};

exports.getRecentProductsFromCategory    =   function (categoryId, callback) {
    productManager.getRecentProductsFromCategory(categoryId,function (err, products) {
        let async   =   require('async');
        var productInfo =   [];
        async.eachSeries(products,function (eachProduct, finish) {
            
        })
        callback(err,products);
    })
};

exports.getProductsFromId =   function (productId,userId,callback) {
    productManager.getProductsFromId(productId,function (err, productBasicInfo,images) {
        materialManager.getMaterialCostMgmt(function (err,mat) {

            if(productBasicInfo.length > 0){
                productBasicInfo[0].baseMaterial    =   mat;
            }
            if(userId != -1) {
                cartManager.isWishListExist(userId, productId, function (isExist, wish) {
                    callback(err, productBasicInfo, images, isExist);
                });
            }else{
                callback(err, productBasicInfo, images, false);
            }

        });
    });
};



exports.addProduct =   function (productData,variantData, callback) {
    productData.productImages   =   JSON.parse(productData.productImages);
    if((productData.productImages != undefined
        && productData.productImages.length != undefined
        && productData.productImages.length > 0)){
        var productImgArray = productData.productImages;
        for(var j=0;j<productImgArray.length;j++){
            var img = productImgArray[j];
            if(img.indexOf(".stl") == -1 && img.indexOf(".STL") == -1){
                productData.defaultImage    =   img;
                //break;
            }
        }
        //productData.defaultImage    =   productData.productImages[0];
    }else if (productData["productImages[]"] != undefined && productData["productImages[]"] != null){
        var productImgArray = productData["productImages[]"];
        for(var j=0;j<productImgArray.length;j++){
            var img = productImgArray[j];
            if(img.indexOf(".stl") == -1 && img.indexOf(".STL") == -1){
                productData.defaultImage    =   img;
                //break;
            }
        }

    }
    console.log("DeafulatImg Set to: ",productData.defaultImage);
    var fixedId  =   productData.productVariableCode;
    fixedSlicerManager.getFixedSlicerFromId(fixedId,function (err, slicer) {
        slicer  =   slicer[0];
        productData.slicer = slicer;
        productManager.addProduct(productData, function (err, product) {
            console.log(err)
            console.log(product)
            if (err || product == undefined || product.insertId == undefined) {
                var productStat = {};
                productStat.productStat = err;
                callback(err, productStat);
            } else {
                var productStat = {};
                productStat.productStat = product;
                if (product.insertId != undefined
                    && (productData.productImages != undefined
                        && productData.productImages.length != undefined
                        && productData.productImages.length > 0) || (productData['productImages[]'] != undefined && productData['productImages[]'].length > 0)) {

                    var productImages = productData.productImages;
                    if (productImages == undefined) {
                        productImages = productData["productImages[]"];
                    }
                    console.log(productImages);
                    var productId = product.insertId;
                    productData.productId = productId;
                    var costManager =   require('../dataAccessLayer/costManagerDA');
                    costManager.calculateAdminProductCost(productData)
                    var images = [];
                    var async = require('async');
                    async.eachSeries(productImages, function (imageName, finish) {
                        productManager.addProductImages(productId, imageName, function (err, status) {
                            if (!err)
                                images.push(imageName);
                            finish();
                        });

                    }, function (err) {
                        productStat.images = images;
                        callback(false, productStat);
                    })
                } else {
                    callback(err, productStat);
                }

            }
        });
    });
};

exports.addUserProduct =   function (productData, callback) {
    //productData.productImages   =   JSON.parse(productData.productImages);
    // if((productData.productImages != undefined
    //         && productData.productImages.length != undefined
    //         && productData.productImages.length > 0)){
    //     productData.defaultImage    =   productData.productImages[0];
    // }else if (productData["productImages[]"] != undefined && productData["productImages[]"] != null){
    //     productData.defaultImage    =   productData["productImages[]"][0];
    // }

    if((productData.productImages != undefined
            && productData.productImages.length != undefined
            && productData.productImages.length > 0)){
        var productImgArray = productData.productImages;
        for(var j=0;j<productImgArray.length;j++){
            var img = productImgArray[j];
            if(img.indexOf(".stl") == -1 && img.indexOf(".STL") == -1){
                productData.defaultImage    =   img;
                //break;
            }
        }
        //productData.defaultImage    =   productData.productImages[0];
    }else if (productData["productImages[]"] != undefined && productData["productImages[]"] != null){
        var productImgArray = productData["productImages[]"];
        for(var j=0;j<productImgArray.length;j++){
            var img = productImgArray[j];
            if(img.indexOf(".stl") == -1 && img.indexOf(".STL") == -1){
                productData.defaultImage    =   img;
                //break;
            }
        }

    }
    productManager.addUserProduct(productData,function (err, product) {
        console.log(err)
        console.log(product)
        if(err || product == undefined || product.insertId == undefined){
            var productStat = {};
            productStat.productStat = err;
            callback(err,productStat);
        }else {
            var productStat = {};
            productStat.productStat = product;
            if(product.insertId != undefined
                && (productData.productImages != undefined
                    && productData.productImages.length != undefined
                    && productData.productImages.length > 0) || (productData['productImages[]'] != undefined && productData['productImages[]'].length > 0)){

                var productImages   =   productData.productImages;
                if(productImages == undefined){
                    productImages   =   productData["productImages[]"];
                }
                console.log(productImages);
                var productId       =   product.insertId;
                var images  =   [];
                var async   =   require('async');
                async.eachSeries(productImages,function (imageName, finish) {
                    productManager.addUserProductImages(productId,imageName,function (err, status) {
                        if(!err)
                            images.push(imageName);
                        finish();
                    });

                },function (err) {
                    productStat.images  =   images;
                    callback(false,productStat);
                })
            }else{
                callback(err,productStat);
            }

        }
    });
};


exports.addUserDoodleProduct =   function (productData, callback) {
    //productData.productImages   =   JSON.parse(productData.productImages);
    // if((productData.productImages != undefined
    //         && productData.productImages.length != undefined
    //         && productData.productImages.length > 0)){
    //     productData.defaultImage    =   productData.productImages[0];
    // }else if (productData["productImages[]"] != undefined && productData["productImages[]"] != null){
    //     productData.defaultImage    =   productData["productImages[]"][0];
    // }

    if((productData.productImages != undefined
            && productData.productImages.length != undefined
            && productData.productImages.length > 0)){
        var productImgArray = productData.productImages;
        for(var j=0;j<productImgArray.length;j++){
            var img = productImgArray[j];
            if(img.indexOf(".stl") == -1 && img.indexOf(".STL") == -1){
                productData.defaultImage    =   img;
                //break;
            }
        }
        //productData.defaultImage    =   productData.productImages[0];
    }else if (productData["productImages[]"] != undefined && productData["productImages[]"] != null){
        var productImgArray = productData["productImages[]"];
        for(var j=0;j<productImgArray.length;j++){
            var img = productImgArray[j];
            if(img.indexOf(".stl") == -1 && img.indexOf(".STL") == -1){
                productData.defaultImage    =   img;
                //break;
            }
        }

    }
    productManager.addUserDoodleProduct(productData,function (err, product) {
        console.log(err)
        console.log(product)
        if(err || product == undefined || product.insertId == undefined){
            var productStat = {};
            productStat.productStat = err;
            callback(err,productStat);
        }else {
            var productStat = {};
            productStat.productStat = product;
            if(product.insertId != undefined
                && (productData.productImages != undefined
                    && productData.productImages.length != undefined
                    && productData.productImages.length > 0) || (productData['productImages[]'] != undefined && productData['productImages[]'].length > 0)){

                var productImages   =   productData.productImages;
                if(productImages == undefined){
                    productImages   =   productData["productImages[]"];
                }
                console.log(productImages);
                var productId       =   product.insertId;
                var images  =   [];
                var async   =   require('async');
                async.eachSeries(productImages,function (imageName, finish) {
                    productManager.addUserProductImages(productId,imageName,function (err, status) {
                        if(!err)
                            images.push(imageName);
                        finish();
                    });

                },function (err) {
                    productStat.images  =   images;
                    callback(false,productStat);
                })
            }else{
                callback(err,productStat);
            }

        }
    });
};

exports.deleteProductBasedOnCategory    =   function (categoryId, callback) {
    productManager.deleteProductBasedOnCategory(categoryId,function (err, stat) {
        callback(err,stat);
    })
};

exports.updateProduct   =   function (productInfo, callback) {
    var addedImages =   JSON.parse(productInfo['addedImages']);
    var deletedIds  =   JSON.parse(productInfo['deletedImages']);
    var productId   =   productInfo.pkProductId;
    
    delete productInfo["addedImages[]"];
    delete productInfo["addedImages"];
    delete productInfo["deletedImages[]"];
    delete productInfo["deletedImages"];
    productManager.addExtraProductImages(productId,addedImages,function () {
        productManager.deleteProductImages(productId,deletedIds,function () {
            productManager.updateProduct(productInfo, function (err, stats) {
                callback(err, stats);
            })
        });
    });
};

exports.deleteProduct   =   function (productId, callback) {
    productManager.deleteProduct(productId,function (err, stats) {
        callback(err,stats);
    })
};

exports.createCoupon    =   function (couponInfo, callback) {
    productManager.createCoupon(couponInfo,function (err, stats) {
        callback(err,stats);
    })
};

exports.updateCoupon   =   function (couponInfo, callback) {
    productManager.updateCoupon(couponInfo,function (err, stats) {
        callback(err,stats);
    })
}

exports.createFAQ    =   function (faqInfo, callback) {
    productManager.createFAQ(faqInfo,function (err, stats) {
        callback(err,stats);
    })
};

exports.updateFAQ   =   function (faqInfo, callback) {
    productManager.updateFAQ(faqInfo,function (err, stats) {
        callback(err,stats);
    })
}

exports.getFAQs   =   function (callback) {
    productManager.getFAQs(function (err, stats) {
        callback(err,stats);
    })
}
exports.getCoupons   =   function (callback) {
    productManager.getCoupons(function (err, stats) {
        callback(err,stats);
    })
}

exports.getCouponFromId   =   function (couponId, callback) {
    productManager.getCouponFromId(couponId, function (err, stats) {
        callback(err,stats);
    })
};
exports.getCouponFromName   =   function (couponName, userId, callback) {
    productManager.getCouponFromName(couponName, function (err, stats) {
        callback(err,stats);
    })
}

exports.getCouponFromNameForReg   =   function (couponName, callback) {
    productManager.getCouponFromNameForReg(couponName, function (err, stats) {
        callback(err,stats);
    })
}