/**
 * Created by anooj on 06/05/17.
 */
var printConfManager =   require('../dataAccessLayer/printerConfDA');

exports.getAllPrinterConf    =   function (callback) {
    printConfManager.getAllPrinterConf(function (err, postPros) {
        callback(err, postPros);
    });
}


exports.getPrinterConfFromId = function (postProId, callback) {
    printConfManager.getPrinterConfFromId(postProId,function (err, postPros) {
        callback(err,postPros);
    });
}

exports.addPrinterConf =   function (postProdata, callback) {
    printConfManager.addPrinterConf(postProdata,function (err, postProStat) {
        if(!err && postProStat != null && postProStat.insertId != undefined) {

                callback(err, postProStat);
        }else{
            callback(err, postProStat);
        }

    });
};

exports.updatePrinterConf =   function (materialData, callback) {
    printConfManager.updatePrinterConf(materialData,function (err, material) {

                callback(err,material);
    });
};
