/**
 * Created by anooj on 06/05/17.
 */
var categoryManager =   require('../dataAccessLayer/tutorialCategoryDA');
var tutorialManager  =   require('../dataAccessLayer/tutorialDA');

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
            var catId   =   categoryData.pkTutorialCatId;
            categoryManager.deleteCategory(catId, function (err, categories) {
                tutorialManager.deleteTutorialBasedOnCategory(catId,function (err, del) {
                    callback(err, categories);
                });
            });
        }else{
            callback(true,"Category does not exist")
        }
    });
}