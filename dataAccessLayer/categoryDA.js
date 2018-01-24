/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var imageOperation  =   require('./imageOperations');

exports.getAllCategories   =   function (callback) {
    connection.executeQuery("select * from categories where isCategoryDeleted=0",[],function (err, categories) {
        callback(err,categories);
    })
};

exports.getAllCategoriesFromId  =   function (categoryId, callback) {
    connection.executeQuery("select * from categories where pkCategoryId = ? and isCategoryDeleted=0",[categoryId],function (err, categories) {
        callback(err,categories);
    })
};

exports.addCategory =   function (categoryData, callback) {
    var catObj  =   {
        categoryName:categoryData.categoryName,
        categoryUnique:categoryData.categoryUnique
    };
    if(categoryData.categoryImage != undefined){
        catObj.categoryImage    =   categoryData.categoryImage;
    }
    if(categoryData.categoryDesc != undefined){
        catObj.categoryDesc    =   categoryData.categoryDesc;
    }
    connection.executeQuery("insert into categories set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateCategory =   function (categoryData, callback) {
    var catId   =   categoryData["pkCategoryId"];
    delete categoryData["pkCategoryId"];
    var catObj  =   {};
    console.log(categoryData)
    if(categoryData.categoryUnique != undefined){
        catObj.categoryUnique    =   categoryData.categoryUnique;
    }
    if(categoryData.categoryDesc != undefined){
        catObj.categoryDesc    =   categoryData.categoryDesc;
    }
    if(categoryData.categoryName != undefined){
        catObj.categoryName    =   categoryData.categoryName;
    }
    if(categoryData.categoryImage != undefined){
        catObj.categoryImage    =   categoryData.categoryImage;
    }
    console.log(categoryData.isImageDeleted)
    if(categoryData.isImageDeleted == true || categoryData.isImageDeleted == 'true'){
        connection.executeQuery("select * from categories where pkCategoryId =?",[catId],function (err, catInfo) {
            if(!err && catInfo.length >0) {
                var oldImg  =   catInfo[0].categoryImage;
                if (oldImg != undefined && oldImg.indexOf("category_default") == -1) {
                    console.log("Deleting")
                    imageOperation.deleteObject(oldImg);
                }
                catObj.categoryImage = "https://3dclubhouse.s3.amazonaws.com/categories/category_default.png";
                updateCategoryInfo(catId,catObj,function (err, status) {
                    callback(err,status);
                })
            }else{
                updateCategoryInfo(catId,catObj,function (err, status) {
                    callback(err,status);
                })
            }
        });
    }else {
        console.log("Final ", catObj)
        updateCategoryInfo(catId,catObj,function (err, status) {
            callback(err,status);
        })
    }
};
var updateCategoryInfo  =   function (catId, catObj, callback) {
    connection.executeQuery("update categories set ? where pkCategoryId = " + catId, [catObj], function (err, status) {
        callback(err, status);
    });
}

exports.deleteCategory  =   function (categoryId, callback) {
    connection.executeQuery("update categories set isCategoryDeleted=1 where pkCategoryId = ?",[categoryId],function (err, status) {
        callback(err,status);
    });
}

exports.isCategoryExist =   function (categoryData, callback) {
    var categoryName, categoryUnique;
    var catParams =   [];
    var query   =   "";

    if(categoryData.categoryName){
        categoryName    =   categoryData.categoryName;
        catParams.push(categoryName);
        query   =   "select * from categories where categoryName like ?";
    }
    if(categoryData.categoryUnique){
        categoryUnique    =   categoryData.categoryUnique;
        catParams.push(categoryUnique);
        query   =   "select * from categories where categoryUnique like ?";
    }
    if(categoryData.categoryUnique && categoryData.categoryName){
        categoryUnique    =   categoryData.categoryUnique;
        catParams.push(categoryUnique);
        categoryName    =   categoryData.categoryName;
        catParams.push(categoryName);
        query   =   "select * from categories where categoryUnique like ? OR categoryName like ?";
    }
    if(categoryData.pkCategoryId != undefined){
        query   =   "select * from categories where pkCategoryId = ?";
        catParams =   [categoryData.pkCategoryId]
    }
    query+=" AND isCategoryDeleted=0";
    console.log(query)
    console.log(catParams)
    connection.executeQuery(query,catParams,function (err, status) {
        if(!err && status != undefined && status.length > 0){
            callback(true,status);
        }else{
            callback(false,status);
        }
    })

};

exports.getProductsOfCategory   =   function (categoryId, userId, pageNumber, search, callback) {
    if(pageNumber == undefined || pageNumber == null){
        pageNumber  =   1;
    }
    var offset      =   (pageNumber-1) * 10;
    //select pr.*,count(wis.pkWishlistId) as isWished from products as pr left join wishlist as wis on (wis.fkProductId=pr.pkProductId and wis.fkUserId=11)  where pr.fkCategoryId=6 and pr.productName like '%com%' limit 0 , 10;
    //var query   =   "select * from products where fkCategoryId=? limit "+offset+" , 10";
    var query   =   "select pr.*,cat.*,count(wis.pkWishlistId) as isWished from products as pr left join wishlist as wis on (wis.fkProductId=pr.pkProductId and wis.fkUserId=?) left join categories as cat on cat.pkCategoryId=pr.fkCategoryId  where pr.fkCategoryId= ? and pr.pkProductId IS NOT NULL and pr.isProductBlocked=0 GROUP BY pr.productName limit "+offset+" , 10;";
    if(search != null){
        //query   =   "select * from products where fkCategoryId=? and productName like '%"+search+"%' limit "+offset+" , 10";
        query   =   "select pr.*,cat.*,count(wis.pkWishlistId) as isWished from products as pr left join wishlist as wis on (wis.fkProductId=pr.pkProductId and wis.fkUserId=?) left join categories as cat on cat.pkCategoryId=pr.fkCategoryId  where pr.fkCategoryId=? and pr.productName like '%"+search+"%' and pr.pkProductId IS NOT NULL and pr.isProductBlocked=0 GROUP BY pr.productName limit "+offset+" , 10";
    }
    console.log(query);
    connection.executeQuery(query,[userId,categoryId],function (err, products) {
        callback(err,products);
    });
}
