/**
 * Created by anooj on 06/05/17.
 */
var taxConfManager =   require('../dataAccessLayer/taxConfigDA');

exports.getAllTaxConf    =   function (callback) {
    taxConfManager.getAllTaxConf(function (err, taxCo) {
        callback(err, taxCo);
    });
}


exports.addTaxConf =   function (taxData, callback) {
    taxConfManager.addTaxConf(taxData,function (err, postProStat) {
        if(!err && postProStat != null && postProStat.insertId != undefined) {
                callback(err, postProStat);
        }else{
            callback(err, postProStat);
        }

    });
};
