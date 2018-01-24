/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var imageOperation  =   require('./imageOperations');

exports.getAllProducts   =   function (callback) {
    connection.executeQuery("select pr.*,cat.categoryName from products as pr left join categories as cat on pr.fkCategoryId=cat.pkCategoryId where pr.isProductBlocked = 0 and pr.isUserProduct = 0 order by pr.productCreatedTime DESC",[],function (err, categories) {
        callback(err,categories);
    })
};

exports.getRecentProducts   =   function (callback) {
    connection.executeQuery("select pr.*,cat.categoryName from products as pr left join categories as cat on pr.fkCategoryId=cat.pkCategoryId where pr.isProductBlocked = 0 and pr.isUserProduct = 0 order by pr.productCreatedTime DESC limit 5",[],function (err, categories) {
        callback(err,categories);
    })
};

exports.getRecentProductsFromCategory   =   function (categoryId, callback) {
    connection.executeQuery("select pr.*,cat.categoryName from products as pr left join categories as cat on pr.fkCategoryId=cat.pkCategoryId where pr.isProductBlocked = 0 and pr.isUserProduct = 0 and pr.fkCategoryId=? order by pr.productCreatedTime DESC limit 10",[categoryId],function (err, categories) {
        callback(err,categories);
    })
};

exports.getProductsFromId  =   function (productId, callback) {
    connection.executeQuery("select pr.*,cat.categoryName from products as pr left join categories as cat on pr.fkCategoryId=cat.pkCategoryId where pr.isProductBlocked = 0 and pr.isUserProduct = 0 and pkProductId=?",[productId],function (err, productBasicInfo) {
        connection.executeQuery("select * from productImages where fkProductId = ?",[productId],function (err, images) {
            if(productBasicInfo != undefined && productBasicInfo != null && productBasicInfo.length > 0){
                var fkVariable = productBasicInfo[0].fk_variable_code;
                connection.executeQuery("select * from fixed_slicer where pk_fixed_id = ?",[fkVariable],function (err, vars) {
                    if(!err && vars!= undefined && vars != null && vars.length > 0){
                        productBasicInfo[0].strength = vars[0].strength;
                        productBasicInfo[0].quality = vars[0].quality;
                        productBasicInfo[0].variable_code = vars[0].variable_code
                    }
                    callback(err, productBasicInfo, images);
                })
            }else {
                callback(err, productBasicInfo, images);
            }
        })

    })
};

exports.addProduct =   function (productData, callback) {
    var date        =   new Date().toString();
    var itemCode    =   Buffer.from(date).toString('base64').substr(0,8);
    var productObj  =   {
        itemCode        :   itemCode,
        productName     :   productData.productName,
        fkCategoryId    :   productData.fkCategoryId,
        productDesc     :   productData.productDesc,
        minHeight       :   productData.productMinHeight,
        minLength       :   productData.productMinLength,
        minBreadth      :   productData.productMinBreadth,
        filamentLength  :   productData.productFilament,
        min_coefficient     :   productData.productMinCoefficient,
        max_coefficient     :   productData.productMaxCoefficient,
        strength        :   productData.slicer.strength,
        quality         :   productData.slicer.quality,
        def_material    :   productData.productMaterialId,
        fk_variable_code    :   productData.productVariableCode,
        fk_pp_id        :   productData.productDefPP,
        printTime       :   productData.productPrintTime,
        defaultImage    :   productData.defaultImage
    };
    console.log("Product: ",productObj);
    connection.executeQuery("insert into products set ?",[productObj],function (err, status) {
        callback(err,status);
    });
};

exports.addUserDoodleProduct =   function (productData, callback) {
    console.log("ADD_USER_PR:",productData);
    //productData =   JSON.parse(productData)
    var productObj  =   {
        fkUserId        :   productData.fkUserId,
        productName     :   productData.productName,
        productDesc     :   productData.productDesc,
        defaultImage    :   productData.defaultImage,
        isUserProduct:1
    };

    connection.executeQuery("insert into products set ?",[productObj],function (err, status) {
        callback(err,status);
    });
};



exports.addUserProduct =   function (productData, callback) {
    console.log("ADD_USER_PR:",productData);
    productData =   JSON.parse(productData)
    var productObj  =   {
        fkUserId        :   productData.fkUserId,
        productName     :   productData.productName,
        productDesc     :   productData.productDesc,
        minHeight          :   productData.productMinHeight,
        minLength          :   productData.productMinLength,
        minBreadth         :   productData.productMinBreadth,
        minPrice :   productData.price,
        def_material:productData.productMaterialId,
        defaultImage    :   productData.defaultImage,
        isUserProduct:1
    };

    connection.executeQuery("insert into products set ?",[productObj],function (err, status) {
        callback(err,status);
    });
};

exports.addUserProductImages    =   function (productId, productImage, callback) {
    var prodImageObj       =    {
        fkProductId:productId,
        productImage:productImage
    };

    connection.executeQuery("insert into productImages set ?",prodImageObj,function (err, stat) {
        callback(err,stat);
    })
};


exports.addProductImages    =   function (productId, productImage, callback) {
    var prodImageObj       =    {
        fkProductId:productId,
        productImage:productImage
    };

    connection.executeQuery("insert into productImages set ?",prodImageObj,function (err, stat) {
        callback(err,stat);
    })
};

exports.deleteProductBasedOnCategory    =   function (categoryId, callback) {
    connection.executeQuery("update products set isProductBlocked = 1 where fkCategoryId=?",[categoryId],function (err, stat) {
        callback(err,stat);
    })
};


exports.updateProduct   =   function (productInfo, callback) {
    var productId   =   productInfo.pkProductId;
    delete productInfo["pkProductId"];
    delete productInfo["productImages"]
    delete productInfo["productImages[]"]
    connection.executeQuery("update products set ? where pkProductId="+productId,productInfo,function (err, stat) {
        callback(err,stat);
    })
};

exports.deleteProductImages  =   function (productId, imageIds, callback) {
    if(imageIds!= undefined && imageIds.length >0) {
        var async = require('async');
        async.eachSeries(imageIds, function (imageId, finish) {
            //imageId =   parseInt(imageId);
            console.log(imageId)
            connection.executeQuery("select * from productImages where pkProductImageId=?",[imageId],function (err, imageInfo) {
                console.log(imageInfo)
                if(!err && imageInfo.length >0){
                    var imageName   =   imageInfo[0].productImage;
                    imageOperation.deleteObject(imageName);
                }
                connection.executeQuery("delete from productImages where pkProductImageId= ?", [imageId], function (err, stat) {
                    console.log(err)
                    console.log(stat)
                    finish();
                })
            });
        }, function (err) {
            callback()
        })
    }else{
        callback();
    }
}

exports.addExtraProductImages  =   function (productId, images, callback) {
    if(images!= undefined && images.length >0) {
        var async = require('async');
        async.eachSeries(images, function (imageName, finish) {
            var prodImageObj = {
                fkProductId: productId,
                productImage: imageName
            };
            connection.executeQuery("insert into productImages set ?", prodImageObj, function (err, stat) {
                finish();
            })
        }, function (err) {
            callback()
        })
    }else{
        callback();
    }
}

exports.deleteProduct   =   function (productId, callback) {
    connection.executeQuery("update products set isProductBlocked=1 where pkProductId=?",[productId],function (err, stat) {
        callback(err,stat);
    })
}

exports.createCoupon    =   function (couponInfo, callback) {

    var couponObj  =   {
        couponCode     :   couponInfo.couponCode,
        pincodeStart    :   couponInfo.pincodeStart,
        pincodeEnd     :   couponInfo.pincodeEnd,
        startsOn       :   couponInfo.startsOn,
        endsOn       :   couponInfo.endsOn,
        status      :   couponInfo.status,
        minimumProductPrice: couponInfo.minimumProductPrice,
        reductionAmount: couponInfo.reductionAmount,
        reductionInPercent: couponInfo.reductionInPercent,
        maxReductionAmount:couponInfo.maxReductionAmount
    };
    if(couponInfo.pincodeStart == "" || couponInfo.pincodeEnd == ""){
        couponObj.isRegistration = 1;
    }
    connection.executeQuery("insert into coupons set ?",[couponObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateCoupon   =   function (couponInfo, callback) {
    var couponId   =   couponInfo.pkCouponId;
    delete couponInfo["pkCouponId"];

    connection.executeQuery("update coupons set ? where pkCouponId="+couponId,couponInfo,function (err, stat) {
        callback(err,stat);
    })
};

exports.createFAQ    =   function (faqInfo, callback) {
    var couponObj  =   {
        question     :   faqInfo.question,
        answer    :   faqInfo.answer
    };

    connection.executeQuery("insert into faq set ?",[couponObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateFAQ   =   function (faqInfo, callback) {
    var faqId   =   faqInfo.pkFaqId;
    delete faqInfo["pkFaqId"];

    connection.executeQuery("update faq set ? where pkFaqId="+faqId,faqInfo,function (err, stat) {
        callback(err,stat);
    })
};

exports.getFAQs   =   function (callback) {
    connection.executeQuery("select * from faq",[],function (err, stat) {
        callback(err,stat);
    })
};

exports.getCoupons   =   function (callback) {
    connection.executeQuery("select * from coupons",[],function (err, stat) {
        callback(err,stat);
    })
};

exports.getCouponFromId =   function (couponId, callback) {
    connection.executeQuery("select * from coupons where pkCouponId=?",[couponId],function (err, stat) {
        callback(err,stat);
    })
}

exports.getCouponFromName =   function (couponName, callback) {
    connection.executeQuery("select * from coupons where couponCode=? and status = 2 and startsOn <= NOW() and endsOn >= NOW()",[couponName],function (err, stat) {
        callback(err,stat);
    })
}
//getCouponFromNameForReg
exports.getCouponFromNameForReg =   function (couponName, callback) {
    connection.executeQuery("select * from coupons where couponCode=? and status = 2 and startsOn <= NOW() and endsOn >= NOW() and isRegistration = 1",[couponName],function (err, stat) {
        callback(err,stat);
    })
}