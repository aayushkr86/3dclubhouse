/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllPostPro   =   function (callback) {
    connection.executeQuery("select pp.*,mat.* from post_process as pp left join materials as mat on mat.pkMaterialId=pp.fk_material_id",[],function (err, postPro) {
        callback(err,postPro);
    })

};


exports.getPostProFromId  =   function (postProId, callback) {
    connection.executeQuery("select pp.*,mat.* from post_process as pp left join materials as mat on mat.pkMaterialId=pp.fk_material_id where pk_post_process_id = ?",[postProId],function (err, materials) {
        callback(err,materials);
    })
};

exports.getPostProOfMaterial = function (materialId, callback) {
    connection.executeQuery("select pp.*,mat.* from post_process as pp left join materials as mat on mat.pkMaterialId=pp.fk_material_id where pp.fk_material_id = ?",[materialId],function (err, materials) {
        callback(err,materials);
    })
}


exports.addPostPro =   function (ppData, callback) {
    var catObj  =   {
        fk_material_id:ppData.fk_material_id,
        process_name:ppData.process_name,
        availability:ppData.availability,
        cost_percentage:ppData.cost_percentage,
        discount_percentage:ppData.discount_percentage,
        final_cost_percentage:ppData.final_cost_percentage
    };
    connection.executeQuery("insert into post_process set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updatePostPro =   function (ppData, callback) {
    var pk_post_process_id  =   ppData.pk_post_process_id;
    var catObj  =   {
        fk_material_id:ppData.fk_material_id,
        process_name:ppData.process_name,
        availability:ppData.availability,
        cost_percentage:ppData.cost_percentage,
        discount_percentage:ppData.discount_percentage,
        final_cost_percentage:ppData.final_cost_percentage
    };
    connection.executeQuery("update post_process set ? where pk_post_process_id=?",[catObj,pk_post_process_id],function (err, status) {
        callback(err,status);
    });
};
