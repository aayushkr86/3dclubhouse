/**
 * Created by anooj on 06/05/17.
 */
var doodlePriceManager =   require('../dataAccessLayer/doodlePriceDA');

exports.getAllDoodlePrices    =   function (callback) {
    doodlePriceManager.getAllDoodlePrices(function (err, materials) {
        callback(err,materials);
    })
};

exports.getDoodlePriceFromId =   function (colorId,callback) {
    doodlePriceManager.getDoodlePriceFromId(colorId,function (err, materials) {
        callback(err,materials);
    });
};


exports.addDoodlePrice =   function (colorData, callback) {
    doodlePriceManager.addDoodlePrice(colorData,function (err, material) {
        callback(err,material);
    });
};

exports.updateDoodlePrice =   function (colorData, callback) {
    doodlePriceManager.updateDoodlePrice(colorData,function (err, material) {
        callback(err,material);
    });
};