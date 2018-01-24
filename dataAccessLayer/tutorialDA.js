/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var imageOperation  =   require('./imageOperations');

exports.getAllTutorials   =   function (callback) {
    connection.executeQuery("select tut.*,tcat.* from tutorials as tut left join tutorialCategories as tcat on tut.fkTutorialCatId=tcat.pkTutorialCatId where tut.isTutDeleted=0",[],function (err, tutorials) {
        callback(err,tutorials);
    })
};

exports.getTutorialFromId  =   function (tutorialId, callback) {
    connection.executeQuery("select tut.*,tcat.* from tutorials as tut left join tutorialCategories as tcat on tut.fkTutorialCatId=tcat.pkTutorialCatId where tut.pkTutorialId = ? and tut.isTutDeleted=0",[tutorialId],function (err, tutorial) {
        connection.executeQuery("select * from tutorialResources where fkTutorialId = ? and isResourceDeleted=0",[tutorialId],function (err, resources) {
            callback(err, tutorial,resources);
        });
    })
};

exports.addTutorial =   function (tutorialData, callback) {
    var tutObj  =   {
        tutorialTitle:tutorialData.tutorialTitle,
        tutorialDesc:tutorialData.tutorialDesc,
        fkTutorialCatId:tutorialData.fkTutorialCatId
    };
    connection.executeQuery("insert into tutorials set ?",[tutObj],function (err, status) {
        callback(err,status);
    });
};

exports.addTutorialResource =   function (tutorialId,tutRes, callback) {
    var tutObj  =   {
        resourceLink:tutRes,
        fkTutorialId:tutorialId
    };
    connection.executeQuery("insert into tutorialResources set ?",[tutObj],function (err, status) {
        callback(err,status);
    });
}

exports.updateTutorial =   function (tutorialData, callback) {
    var tutorialId =   tutorialData.pkTutorialId;
    var tutObj  =   {
        tutorialTitle:tutorialData.tutorialTitle,
        tutorialDesc:tutorialData.tutorialDesc,
        fkTutorialCatId:tutorialData.fkTutorialCatId
    };
    connection.executeQuery("update tutorials set ? where pkTutorialId=?",[tutObj,tutorialId],function (err, status) {
        callback(err,status);
    });
};


exports.deleteTutorialBasedOnCategory    =   function (categoryId, callback) {
    connection.executeQuery("update tutorials set isTutDeleted = 1 where fkTutorialCatId=?",[categoryId],function (err, stat) {
        callback(err,stat);
    })
};



exports.deleteTutorialResources  =   function (tutorialId, imageIds, callback) {
    if(imageIds!= undefined && imageIds.length >0) {
        var async = require('async');
        async.eachSeries(imageIds, function (imageId, finish) {
            //imageId =   parseInt(imageId);
            console.log(imageId)
            connection.executeQuery("select * from tutorialResources where pkTutorialResId=?",[imageId],function (err, resourceInfo) {
                console.log(resourceInfo)
                if(!err && resourceInfo.length >0){
                    var imageName   =   resourceInfo[0].resourceLink;
                    imageOperation.deleteObject(imageName);
                }
                connection.executeQuery("delete from tutorialResources where pkTutorialResId= ?", [imageId], function (err, stat) {
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

exports.addExtraTutorialResources  =   function (tutorialId, images, callback) {
    if(images!= undefined && images.length >0) {
        var async = require('async');
        async.eachSeries(images, function (imageName, finish) {
            var prodImageObj = {
                fkTutorialId: tutorialId,
                resourceLink: imageName
            };
            connection.executeQuery("insert into tutorialResources set ?", prodImageObj, function (err, stat) {
                finish();
            })
        }, function (err) {
            callback()
        })
    }else{
        callback();
    }
}

exports.deleteTutorial   =   function (tutorialId, callback) {
    connection.executeQuery("update tutorials set isTutDeleted=1 where pkTutorialId=?",[tutorialId],function (err, stat) {
        callback(err,stat);
    })
};
