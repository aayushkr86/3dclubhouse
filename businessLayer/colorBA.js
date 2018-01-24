/**
 * Created by anooj on 06/05/17.
 */
var colorManager =   require('../dataAccessLayer/colorDA');

exports.getAllColors    =   function (callback) {
    colorManager.getAllColors(function (err, materials) {
        callback(err,materials);
    })
};

exports.getColorFromId =   function (colorId,callback) {
    colorManager.getColorFromId(colorId,function (err, materials) {
        callback(err,materials);
    });
};

exports.getColorsOfMaterial =   function (materialId,callback) {
    colorManager.getColorsOfMaterial(materialId,function (err, materials) {
        callback(err,materials);
    });
};

exports.addColor =   function (colorData, callback) {
    colorManager.addColor(colorData,function (err, material) {
        callback(err,material);
    });
};

exports.updateColor =   function (colorData, callback) {
    colorManager.updateColor(colorData,function (err, material) {
        callback(err,material);
    });
};