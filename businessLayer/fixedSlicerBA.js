/**
 * Created by anooj on 06/05/17.
 */
var fixedSlicerManager =   require('../dataAccessLayer/fixedSlicerDA');

exports.getAllFixedSlicer    =   function (callback) {
    fixedSlicerManager.getAllFixedSlicer(function (err, postPros) {
        callback(err, postPros);
    });
}


exports.getFixedSlicerFromId = function (postProId, callback) {
    fixedSlicerManager.getFixedSlicerFromId(postProId,function (err, postPros) {
        callback(err,postPros);
    });
}

exports.getFixedSlicerFromVarCode = function (varcode, callback) {
    fixedSlicerManager.getFixedSlicerFromVarCode(varcode,function (err, postPros) {
        callback(err,postPros);
    });
}

exports.addFixedSlicer =   function (postProdata, callback) {
    fixedSlicerManager.addFixedSlicer(postProdata,function (err, postProStat) {
        if(!err && postProStat != null && postProStat.insertId != undefined) {

                callback(err, postProStat);
        }else{
            callback(err, postProStat);
        }

    });
};

exports.updateFixedSlicer =   function (materialData, callback) {
    fixedSlicerManager.updateFixedSlicer(materialData,function (err, material) {

                callback(err,material);
    });
};
