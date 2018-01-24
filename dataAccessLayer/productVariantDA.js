/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();


exports.getVariantsOfProductId  =   function (productId, callback) {
    connection.executeQuery("select * from productVariants where fkProductId = ?",[productId],function (err, productVariants) {
        callback(err,productVariants);
    })
};

exports.addVariant =   function (variantData, callback) {
    var productVariantObj  =   {
        fkProductId     :   variantData.fkProductId,
        fkMaterialId    :   variantData.fkMaterialId,
        productVolume   :   variantData.productVolume,
        productColor    :   variantData.productColor,
        productQuality  :   variantData.productQuality,
        productCost     :   variantData.productCost,
        productStock    :   variantData.productStock,
        productLength   :   variantData.productLength,
        productBreadth  :   variantData.productBreadth,
        productHeight   :   variantData.productHeight
    };
    connection.executeQuery("insert into productVariants set ?",[productVariantObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateVariant =   function (variantData, callback) {
    var productVariantObj  =   {
        fkProductId     :   variantData.fkProductId,
        fkMaterialId    :   variantData.fkMaterialId,
        productVolume   :   variantData.productVolume,
        productColor    :   variantData.productColor,
        productQuality  :   variantData.productQuality,
        productCost     :   variantData.productCost,
        productStock    :   variantData.productStock
    };
    connection.executeQuery("update productVariants set ? where pkProductVariantId = ?",[productVariantObj,variantData.pkProductVariantId],function (err, status) {
        callback(err,status);
    });
};

exports.checkVariantExist   =   function (variantData, callback) {
    var variants    =   [
        variantData.fkProductId,
        variantData.fkMaterialId,
        variantData.productVolume,
        variantData.productColor,
        variantData.productQuality
    ];

    var query   =   "select * from productVariants where " +
        "fkProductId = ? AND fkMaterialId = ? AND productVolume = ? AND " +
        "productColor = ? AND productQuality = ?";
    if(variantData.pkProductVariantId != undefined){
        variants.push(variantData.pkProductVariantId);
        query   =   "select * from productVariants where " +
            "fkProductId = ? AND fkMaterialId = ? AND productVolume = ? AND " +
            "productColor = ? AND productQuality = ? AND pkProductVariantId = ?";
    }
    connection.executeQuery(query,variants,function (err, variants) {
        if(!err && variants != undefined && variants.length > 0){
            callback(true);
        }else{
            callback(false);
        }
    });
};


