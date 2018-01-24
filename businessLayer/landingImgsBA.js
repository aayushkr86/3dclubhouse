/**
 * Created by anooj on 30/05/17.
 */
var landingImgManager =   require('../dataAccessLayer/landingImgsDA');

exports.addLandingImage = function (imgName, callback) {
    landingImgManager.addLandingImage(imgName, function (err,stat) {
        callback(err,stat);
    });
};

exports.getAllLandingImgs = function (callback) {
    landingImgManager.getAllLandingImgs( function (err,stat) {
        callback(err,stat);
    });
};

exports.deleteImages = function (ids,callback) {
    var async = require('async');
    var stats = [];
    var error = false;
    async.eachSeries(ids,function (id, finish) {
        landingImgManager.deleteImg(id, function (err,stat) {
            error = err;
            stats.push(stat);
            finish();
        });
    },function (done) {
        callback(error,stats);
    })

};