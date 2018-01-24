/**
 * Created by anooj on 30/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.addHomeImage    =   function (imgName, callback) {
    var obj = {
        homeimageurl:imgName
    }
    connection.executeQuery("insert into home_images set ?",obj,function (err, stat) {
        callback(err,stat);
    })
};

exports.getAllHomeImgs = function (callback) {
    connection.executeQuery("select * from home_images where is_deleted=0",[],function (err, stat) {
        callback(err,stat);
    });
};

exports.deleteImg = function (id, callback) {
    connection.executeQuery("update home_images set is_deleted=1 where pkhomeimgid =?",[id],function (err, stat) {
        callback(err,stat);
    });
}