/**
 * Created by anooj on 30/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.addLandingImage    =   function (imgName, callback) {
    var obj = {
        landingimg_url:imgName
    }
    connection.executeQuery("insert into landing_images set ?",obj,function (err, stat) {
        callback(err,stat);
    })
};

exports.getAllLandingImgs = function (callback) {
    connection.executeQuery("select * from landing_images where is_deleted=0",[],function (err, stat) {
        callback(err,stat);
    });
};

exports.deleteImg = function (id, callback) {
    connection.executeQuery("update landing_images set is_deleted=1 where pk_landingimg_id =?",[id],function (err, stat) {
        callback(err,stat);
    });
}