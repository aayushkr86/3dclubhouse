/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var imageOperation  =   require('./imageOperations');

exports.getAllCategories   =   function (callback) {
    connection.executeQuery("select * from tutorialCategories where isTutCatDeleted=0",[],function (err, categories) {
        callback(err,categories);
    })
};

exports.getAllCategoriesFromId  =   function (categoryId, callback) {
    connection.executeQuery("select * from tutorialCategories where pkTutorialCatId = ? and isTutCatDeleted=0",[categoryId],function (err, categories) {
        callback(err,categories);
    })
};

exports.addCategory =   function (categoryData, callback) {
    var catObj  =   {
        tutorialCategoryName:categoryData.tutorialCategoryName,
        tutorialLevel:categoryData.tutorialLevel
    };
    if(categoryData.tutorialCatImage != undefined){
        catObj.tutorialCatImage    =   categoryData.tutorialCatImage;
    }

    connection.executeQuery("insert into tutorialCategories set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateCategory =   function (categoryData, callback) {
    var catId   =   categoryData["pkTutorialCatId"];
    delete categoryData["pkTutorialCatId"];
    var catObj  =   {};
    console.log(categoryData)

    if(categoryData.tutorialCategoryName != undefined){
        catObj.tutorialCategoryName    =   categoryData.tutorialCategoryName;
    }
    if(categoryData.tutorialLevel != undefined){
        catObj.tutorialLevel    =   categoryData.tutorialLevel;
    }

    if(categoryData.isNewImage != undefined && (categoryData.isNewImage == true || categoryData.isNewImage == 'true')){
        if(categoryData.tutorialCatImage != undefined){
            catObj.tutorialCatImage    =   categoryData.tutorialCatImage;
        }
    }
    console.log(categoryData.isImageDeleted)
    if(categoryData.isImageDeleted == true || categoryData.isImageDeleted == 'true' || (categoryData.isNewImage != undefined && (categoryData.isNewImage == true || categoryData.isNewImage == 'true'))){
        connection.executeQuery("select * from tutorialCategories where pkTutorialCatId =?",[catId],function (err, catInfo) {
            if(!err && catInfo.length >0) {
                var oldImg  =   catInfo[0].tutorialCatImage;
                if (oldImg != undefined && oldImg.indexOf("category_default") == -1) {
                    console.log("Deleting")
                    imageOperation.deleteObject(oldImg);
                }
                catObj.tutorialCatImage = "https://3dclubhouse.s3.amazonaws.com/categories/category_default.png";
                if(categoryData.isNewImage != undefined && (categoryData.isNewImage == true || categoryData.isNewImage == 'true')){
                    if(categoryData.tutorialCatImage != undefined){
                        catObj.tutorialCatImage    =   categoryData.tutorialCatImage;
                    }
                }
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
    connection.executeQuery("update tutorialCategories set ? where pkTutorialCatId = " + catId, [catObj], function (err, status) {
        callback(err, status);
    });
}

exports.deleteCategory  =   function (categoryId, callback) {
    connection.executeQuery("update tutorialCategories set isTutCatDeleted=1 where pkTutorialCatId = ?",[categoryId],function (err, status) {
        callback(err,status);
    });
}

exports.isCategoryExist =   function (categoryData, callback) {
    var tutorialCategoryName, categoryUnique;
    var catParams =   [];
    var query   =   "";

    if(categoryData.tutorialCategoryName){
        tutorialCategoryName    =   categoryData.tutorialCategoryName;
        catParams.push(tutorialCategoryName);
        query   =   "select * from tutorialCategories where tutorialCategoryName like ?";
    }

    if(categoryData.pkTutorialCatId != undefined){
        query   =   "select * from tutorialCategories where pkTutorialCatId = ?";
        catParams =   [categoryData.pkTutorialCatId]
    }
    query+=" AND isTutCatDeleted=0";
    connection.executeQuery(query,catParams,function (err, status) {
        if(!err && status != undefined && status.length > 0){
            callback(true);
        }else{
            callback(false);
        }
    })

};
