/**
 * Created by anooj on 30/05/17.
 */
var homeImgManager =   require('../dataAccessLayer/homeImgsDA');

exports.addHomeImage = function (imgName, callback) {
    homeImgManager.addHomeImage(imgName, function (err,stat) {
        callback(err,stat);
    });
};

exports.getAllHomeImgs = function (callback) {
    homeImgManager.getAllHomeImgs( function (err,stat) {
        callback(err,stat);
    });
};

exports.deleteImages = function (ids,callback) {
    var async = require('async');
    var stats = [];
    var error = false;
    async.eachSeries(ids,function (id, finish) {
        homeImgManager.deleteImg(id, function (err,stat) {
            error = err;
            stats.push(stat);
            finish();
        });
    },function (done) {
        callback(error,stats);
    })

};