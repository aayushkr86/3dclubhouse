/**
 * Created by anooj on 06/05/17.
 */
var categoryManager =   require('../dataAccessLayer/categoryDA');
var productManager  =   require('../dataAccessLayer/productDA');

exports.getAllCategories    =   function (callback) {
    categoryManager.getAllCategories(function (err, categories) {
        callback(err,categories);
    })
};

exports.getAllCategoriesFromId =   function (categoryId,callback) {
    categoryManager.getAllCategoriesFromId(categoryId,function (err, categories) {
        callback(err,categories);
    });
};

exports.addCategory =   function (categoryData, callback) {
    let catName =   categoryData.categoryName;
    categoryData.categoryUnique =   catName.replace(/\s+/g, '-').toLowerCase();
    categoryManager.isCategoryExist(categoryData,function (isExist) {
        if(!isExist) {
            categoryManager.addCategory(categoryData, function (err, categories) {
                callback(err, categories);
            });
        }else{
            callback(true,"Category Already Exist")
        }
    });
};

exports.updateCategory  =   function (categoryData, callback) {
    categoryManager.isCategoryExist(categoryData,function (isExist) {
        if(isExist) {
            categoryManager.updateCategory(categoryData, function (err, categories) {
                callback(err, categories);
            });
        }else{
            callback(true,"Category does not exist")
        }
    });
}

exports.deleteCategory  =   function (categoryData, callback) {
    categoryManager.isCategoryExist(categoryData,function (isExist) {
        if(isExist) {
            var catId   =   categoryData.pkCategoryId;
            categoryManager.deleteCategory(catId, function (err, categories) {
                productManager.deleteProductBasedOnCategory(catId,function (err, del) {
                    callback(err, categories);
                });
            });
        }else{
            callback(true,"Category does not exist")
        }
    });
};

exports.isCategoryExist =   function (categoryData, callback) {
    categoryManager.isCategoryExist(categoryData,function (isExist, data) {
        callback(isExist, data);
    });
};

exports.getProductsOfCategory   =   function (categoryId,userId, page, search, callback) {
    categoryManager.getProductsOfCategory(categoryId,userId,page,search,function (err,products) {
        callback(err,products);
    });
}