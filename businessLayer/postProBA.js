/**
 * Created by anooj on 06/05/17.
 */
var postProManager =   require('../dataAccessLayer/postProDA');

exports.getAllPostPro    =   function (callback) {
    postProManager.getAllPostPro(function (err, postPros) {
        callback(err, postPros);
    });
}


exports.getPostProOfMaterial =   function (materialId,callback) {
    postProManager.getPostProOfMaterial(materialId,function (err, postPros) {
        if(!err && postPros != undefined && postPros.length > 0){
                callback(err,postPros);
        }else {
            callback(err, postPros);
        }
    });
};

exports.getPostProFromId = function (postProId, callback) {
    postProManager.getPostProFromId(postProId,function (err, postPros) {
        callback(err,postPros);
    });
}

exports.addPostPro =   function (postProdata, callback) {
    postProManager.addPostPro(postProdata,function (err, postProStat) {
        if(!err && postProStat != null && postProStat.insertId != undefined) {

                callback(err, postProStat);
        }else{
            callback(err, postProStat);
        }

    });
};

exports.updatePostPro =   function (materialData, callback) {
    postProManager.updatePostPro(materialData,function (err, material) {

                callback(err,material);
    });
};
