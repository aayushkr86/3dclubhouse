/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllPrinterConf   =   function (callback) {
    connection.executeQuery("select * from printer_dimension",[],function (err, postPro) {
        callback(err,postPro);
    })

};


exports.getPrinterConfFromId  =   function (printConfId, callback) {
    connection.executeQuery("select * from printer_dimension where pk_printer_dim_id = ?",[printConfId],function (err, materials) {
        callback(err,materials);
    })
};

exports.addPrinterConf =   function (ppData, callback) {
    var catObj  =   {
        printer_code:ppData.printer_code,
        min_dimension:ppData.min_dimension,
        max_dimension:ppData.max_dimension,
        printer_rate:ppData.printer_rate
    };
    connection.executeQuery("insert into printer_dimension set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updatePrinterConf =   function (ppData, callback) {
    var pk_printer_dim_id  =   ppData.pk_printer_dim_id;
    var catObj  =   {
        printer_code:ppData.printer_code,
        min_dimension:ppData.min_dimension,
        max_dimension:ppData.max_dimension,
        printer_rate:ppData.printer_rate
    };
    connection.executeQuery("update printer_dimension set ? where pk_printer_dim_id=?",[catObj,pk_printer_dim_id],function (err, status) {
        callback(err,status);
    });
};
