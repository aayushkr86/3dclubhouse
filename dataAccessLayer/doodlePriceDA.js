/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllDoodlePrices   =   function (callback) {
    connection.executeQuery("select * from doodle_prices",[],function (err, materials) {
        callback(err,materials);
    })
};

exports.getDoodlePriceFromId  =   function (DoodlePriceId, callback) {
    connection.executeQuery("select * from doodle_prices where pk_doodle_price_id = ?",[DoodlePriceId],function (err, materials) {
        callback(err,materials);
    })
};

exports.addDoodlePrice =   function (priceData, callback) {
    var catObj  =   {
        price:priceData.price
    };
    connection.executeQuery("insert into doodle_prices set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateDoodlePrice =   function (priceData, callback) {
    var DoodlePriceId =   priceData.pk_doodle_price_id;
    var catObj  =   {
        price:priceData.price
    };
    connection.executeQuery("update doodle_prices set ? where pk_doodle_price_id=?",[catObj,DoodlePriceId],function (err, status) {
        callback(err,status);
    });
};
