/**
 * Created by anooj on 06/05/17.
 */
var tutorialManager =   require('../dataAccessLayer/tutorialDA');

exports.getAllTutorials    =   function (callback) {
    tutorialManager.getAllTutorials(function (err, tutorials) {
        callback(err,tutorials);
    })
};

exports.getAllTutorialsWithMedia    =   function (callback) {
    tutorialManager.getAllTutorials(function (err, tutorials) {
        var tuts=   [];
        var async   =   require('async');
        async.eachSeries(tutorials,function (tut, finish) {

            tutorialManager.getTutorialFromId(tut.pkTutorialId,function (err, tutorials,resources) {
                tut.media   =   resources;
                tuts.push(tut);
                finish();
            })
        },function (done) {
            callback(err,tuts);
        })
        //callback(err,tutorials);
    })
};

exports.getTutorialFromId =   function (tutorialId,callback) {
    tutorialManager.getTutorialFromId(tutorialId,function (err, tutorials,resources) {
        callback(err,tutorials,resources);
    });
};

// exports.addTutorial =   function (tutorialData, callback) {
//     tutorialManager.addTutorial(tutorialData,function (err, tutorial) {
//         callback(err,tutorial);
//     });
// };

exports.addTutorial =   function (tutorialData, callback) {
    tutorialManager.addTutorial(tutorialData,function (err, tutorial) {
        console.log(err)
        console.log(tutorial)
        if(err || tutorial == undefined || tutorial.insertId == undefined){
            var tutorialStat = {};
            tutorialStat.tutorialStat = err;
            callback(err,tutorialStat);
        }else {
            var tutorialStat = {};
            tutorialStat.tutorialStat = tutorial;
            if(tutorial.insertId != undefined
                && (tutorialData.tutorialResources != undefined
                && tutorialData.tutorialResources.length != undefined
                && tutorialData.tutorialResources.length > 0) || (tutorialData['tutorialResources[]'] != undefined && tutorialData['tutorialResources[]'].length > 0)){

                var tutorialResources   =   tutorialData.tutorialResources;
                if(tutorialResources == undefined){
                    tutorialResources   =   tutorialData["tutorialResources[]"];
                }
                console.log(tutorialResources);
                var tutorialId       =   tutorial.insertId;
                var resources  =   [];
                var async   =   require('async');
                async.eachSeries(tutorialResources,function (resourceData, finish) {
                    tutorialManager.addTutorialResource(tutorialId,resourceData,function (err, status) {
                        if(!err)
                            resources.push(resourceData);
                        finish();
                    });

                },function (err) {
                    tutorialStat.resources  =   resources;
                    callback(false,tutorialStat);
                })
            }else{
                callback(err,tutorialStat);
            }

        }
    });
};

//
// exports.updateTutorial =   function (tutorialData, callback) {
//     tutorialManager.updateTutorial(tutorialData,function (err, tutorial) {
//         callback(err,tutorial);
//     });
// };

exports.updateTutorial   =   function (tutorialInfo, callback) {
    var addedImages =   JSON.parse(tutorialInfo['addedResources']);
    var deletedIds  =   JSON.parse(tutorialInfo['deletedResources']);
    var tutorialId   =   tutorialInfo.pkTutorialId;

    delete tutorialInfo["addedResources[]"];
    delete tutorialInfo["addedResources"];
    delete tutorialInfo["deletedResources[]"];
    delete tutorialInfo["deletedResources"];
    tutorialManager.addExtraTutorialResources(tutorialId,addedImages,function () {
        tutorialManager.deleteTutorialResources(tutorialId,deletedIds,function () {
            tutorialManager.updateTutorial(tutorialInfo, function (err, stats) {
                callback(err, stats);
            })
        });
    });
};