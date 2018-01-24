/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllPackageConf   =   function (callback) {
    connection.executeQuery("select * from packaging_conf",[],function (err, postPro) {
        callback(err,postPro);
    })

};


exports.getPackageConfFromId  =   function (printConfId, callback) {
    connection.executeQuery("select * from packaging_conf where pk_package_conf_id = ?",[printConfId],function (err, materials) {
        callback(err,materials);
    })
};

exports.addPackageConf =   function (ppData, callback) {
    var catObj  =   {
        min_length:ppData.min_length,
        max_length:ppData.max_length,
        min_breadth:ppData.min_breadth,
        max_breadth:ppData.max_breadth,
        min_height:ppData.min_height,
        max_height:ppData.max_height,
        package_cost:ppData.package_cost
    };
    connection.executeQuery("insert into packaging_conf set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updatePackageConf =   function (ppData, callback) {
    var pk_package_conf_id  =   ppData.pk_package_conf_id;
    var catObj  =   {
        min_length:ppData.min_length,
        max_length:ppData.max_length,
        min_breadth:ppData.min_breadth,
        max_breadth:ppData.max_breadth,
        min_height:ppData.min_height,
        max_height:ppData.max_height,
        package_cost:ppData.package_cost
    };
    connection.executeQuery("update packaging_conf set ? where pk_package_conf_id=?",[catObj,pk_package_conf_id],function (err, status) {
        callback(err,status);
    });
};
