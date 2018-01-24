/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllColors   =   function (callback) {
    connection.executeQuery("select * from colors",[],function (err, materials) {
        callback(err,materials);
    })
};

exports.getColorFromId  =   function (colorId, callback) {
    connection.executeQuery("select * from colors where pkColorId = ?",[colorId],function (err, materials) {
        callback(err,materials);
    })
};
//

exports.getColorsOfMaterial  =   function (materialId, callback) {
    connection.executeQuery("select mac.*,col.* from material_colors as mac left join colors as col on col.pkColorId=mac.fk_color_id where mac.fk_material_id = ?",[materialId],function (err, colors) {
        callback(err,colors);
    })
};

exports.addColor =   function (colorData, callback) {
    var catObj  =   {
        colorName:colorData.colorName,
        color_hex:colorData.color_hex
    };
    connection.executeQuery("insert into colors set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateColor =   function (colorData, callback) {
    var colorId =   colorData.pkColorId;
    var catObj  =   {
        colorName:colorData.colorName,
        color_hex:colorData.colorHex
    };
    connection.executeQuery("update colors set ? where pkColorId=?",[catObj,colorId],function (err, status) {
        callback(err,status);
    });
};
