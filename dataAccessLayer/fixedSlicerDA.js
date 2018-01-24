/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllFixedSlicer   =   function (callback) {
    connection.executeQuery("select * from fixed_slicer",[],function (err, postPro) {
        callback(err,postPro);
    })

};


exports.getFixedSlicerFromId  =   function (printConfId, callback) {
    connection.executeQuery("select * from fixed_slicer where pk_fixed_id = ?",[printConfId],function (err, materials) {
        callback(err,materials);
    })
};

//
exports.getFixedSlicerFromVarCode  =   function (printConfId, callback) {
    connection.executeQuery("select * from fixed_slicer where variable_code = ?",[printConfId],function (err, materials) {
        callback(err,materials);
    })
};

exports.addFixedSlicer =   function (ppData, callback) {
    var catObj  =   {
        quality:ppData.quality,
        strength:ppData.strength,
        variable_code:ppData.variable_code
    };
    connection.executeQuery("insert into fixed_slicer set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateFixedSlicer =   function (ppData, callback) {
    var pk_fixed_id  =   ppData.pk_fixed_id;
    var catObj  =   {
        quality:ppData.quality,
        strength:ppData.strength,
        variable_code:ppData.variable_code
    };
    connection.executeQuery("update fixed_slicer set ? where pk_fixed_id=?",[catObj,pk_fixed_id],function (err, status) {
        callback(err,status);
    });
};
