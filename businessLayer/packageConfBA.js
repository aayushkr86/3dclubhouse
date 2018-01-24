/**
 * Created by anooj on 06/05/17.
 */
var packageConfManager =   require('../dataAccessLayer/packageConfDA');

exports.getAllPackageConf    =   function (callback) {
    packageConfManager.getAllPackageConf(function (err, postPros) {
        callback(err, postPros);
    });
}


exports.getPackageConfFromId = function (postProId, callback) {
    packageConfManager.getPackageConfFromId(postProId,function (err, postPros) {
        callback(err,postPros);
    });
}

exports.addPackageConf =   function (postProdata, callback) {
    packageConfManager.addPackageConf(postProdata,function (err, postProStat) {
        if(!err && postProStat != null && postProStat.insertId != undefined) {

                callback(err, postProStat);
        }else{
            callback(err, postProStat);
        }

    });
};

exports.updatePackageConf =   function (materialData, callback) {
    packageConfManager.updatePackageConf(materialData,function (err, material) {

                callback(err,material);
    });
};
