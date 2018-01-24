/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllTaxConf   =   function (callback) {
    connection.executeQuery("select * from tax_config limit 1",[],function (err, postPro) {
        callback(err,postPro);
    })

};


exports.addTaxConf =   function (txData, callback) {
    var catObj  =   {
        markup_1:txData.markup_1,
        markup_2:txData.markup_2,
        gst_print:txData.gst_print,
        shipping:txData.shipping,
        discount_print:txData.discount_print
    };
    connection.executeQuery("delete from tax_config",[],function (err, delStatus) {
        connection.executeQuery("insert into tax_config set ?", [catObj], function (err, status) {
            callback(err, status);
        });
    });
};

