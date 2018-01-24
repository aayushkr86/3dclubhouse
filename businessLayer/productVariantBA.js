/**
 * Created by anooj on 06/05/17.
 */
var productVariantManager =   require('../dataAccessLayer/productVariantDA');



exports.getVariantsOfProductId =   function (productId,callback) {
    productVariantManager.getVariantsOfProductId(productId,function (err, productVariants) {
        callback(err,productVariants);
    });
};

exports.addVariant =   function (variantData, callback) {
    productVariantManager.checkVariantExist(variantData,function (isExist) {
        if(!isExist) {
            productVariantManager.addVariant(variantData, function (err, variant) {
                callback(err, variant);
            });
        }else{
            callback(true,"Variant Already Exist");
        }
    });
};

exports.updateVariant =   function (variantData, callback) {
    productVariantManager.checkVariantExist(variantData,function (isExist) {
        if(!isExist) {
            productVariantManager.addVariant(variantData, function (err, variant) {
                callback(err, variant);
            });
        }else{
            callback(true,"Variant Already Exist");
        }
    });
};