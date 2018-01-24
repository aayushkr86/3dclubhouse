/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();

exports.getAllMaterials   =   function (callback) {
    connection.executeQuery("select * from materials",[],function (err, materials) {
        callback(err,materials);
    })

};//

exports.getAllNonBaseMaterials   =   function (callback) {
    getOtherNonBaseMaterials(function (err, materials) {
        callback(err,materials);
    })
};

exports.getMaterialsFromId  =   function (materialId, callback) {
    connection.executeQuery("select * from materials where pkMaterialId = ?",[materialId],function (err, materials) {
        callback(err,materials);
    })
};

exports.getMaterialColors = function (materialId, callback) {
    connection.executeQuery("select mat.*,col.* from material_colors as mat left join colors as col on col.pkColorId=mat.fk_color_id where mat.fk_material_id = ?",[materialId],function (err, materials) {
        callback(err,materials);
    })
}

exports.addColorsToMaterial = function (colors, materialId, callback) {
    var async   =   require('async');
    var status  =   [];
    var error   =   false;
    async.eachSeries(colors,function (colorId, finish) {
        var obj = {
            fk_material_id:materialId,
            fk_color_id:colorId
        };
        connection.executeQuery("insert into material_colors set ?",obj,function (err, materials) {
                status.push(materials);
                error = err;
             finish();
        })
    },function (done) {
        callback(error,status);
    });
};
exports.deleteAllMaterialColors = function (materialId, callback) {
    connection.executeQuery("delete from material_colors where fk_material_id=?",[materialId],function (err, materials) {
        callback(err,materials);
    })
}

exports.addMaterial =   function (categoryData, callback) {
    var catObj  =   {
        materialName:categoryData.materialName,
        materialDesc:categoryData.materialDesc,
        materialCost:categoryData.materialCost,
        materialWeight:categoryData.materialWeight
    };
    connection.executeQuery("insert into materials set ?",[catObj],function (err, status) {
        callback(err,status);
    });
};

exports.updateMaterial =   function (categoryData, callback) {
    var materialId  =   categoryData.pkMaterialId;
    var catObj  =   {
        materialName:categoryData.materialName,
        materialDesc:categoryData.materialDesc,
        materialCost:categoryData.materialCost,
        materialWeight:categoryData.materialWeight
    };
    connection.executeQuery("update materials set ? where pkMaterialId=?",[catObj,materialId],function (err, status) {
        callback(err,status);
    });
};

exports.updateBaseMaterialOnly  =   function (materialData, callback) {
    var materialId  =   parseInt(materialData.baseMaterialId);
    var finalStat   =   {};
    finalStat.isSameBaseMaterial    =   0;
    finalStat.isOthersAssigned      =   0;

    connection.executeQuery("select * from materials where isBaseMaterial=1",[],function (err, baseMat) {
        if(!err && baseMat != undefined && baseMat.length > 0){
            finalStat.fkBaseMaterial    =   baseMat[0];
            if(materialId == baseMat[0].pkMaterialId){
                finalStat.isSameBaseMaterial    =   1;

                connection.executeQuery("select mc.*,mat.* from materialcost as mc left join materials as mat on mat.pkMaterialId=mc.fkMaterialId", [], function (err, otherMat) {
                    if(otherMat != undefined && otherMat.length >0) {
                        finalStat.isOthersAssigned      =   1;
                        finalStat.otherMaterials = otherMat;
                        callback(err,finalStat);
                    }else{
                        getOtherNonBaseMaterials(function (err, otherMats) {
                            finalStat.isOthersAssigned      =   0;
                            finalStat.fkBaseMaterialId  =   materialId
                            finalStat.otherMaterials    =   otherMats;
                            callback(err,finalStat);
                        })

                    }

                });
            }else{
                finalStat.isSameBaseMaterial    =   0;
                var obj =   {
                    isBaseMaterial:0,
                    baseLength:0,
                    baseBreadth:0,
                    baseHeight:0,
                    materialCost:0,
                    l_ratio:0,
                    b_ratio:0,
                    h_ratio:0,
                    quality_percentage:""
                };
                connection.executeQuery("update materials set ?",[obj],function (err, upStat) {
                    //delete existing matcost
                    connection.executeQuery("delete from materialcost", [], function (err, delStat) {
                        //update base mat
                        connection.executeQuery("update materials set isBaseMaterial=1 where pkMaterialId=?", [materialId], function (err, status) {
                            connection.executeQuery("select * from materials where isBaseMaterial=1",[],function (err, baseMater) {
                                finalStat.fkBaseMaterial    =   baseMater[0];
                                getOtherNonBaseMaterials(function (err, otherMats) {
                                    finalStat.isOthersAssigned = 0;
                                    finalStat.fkBaseMaterialId = materialId
                                    finalStat.otherMaterials = otherMats;
                                    callback(err, finalStat);
                                })
                            });
                        })
                    });
                });

            }
        }else{
            //update base mat
            connection.executeQuery("update materials set isBaseMaterial=1 where pkMaterialId=?",[materialId],function (err, status) {
                connection.executeQuery("select * from materials where isBaseMaterial=1",[],function (err, baseMater) {
                    finalStat.isSameBaseMaterial = 0;
                    finalStat.fkBaseMaterialId = materialId;
                    finalStat.fkBaseMaterial    =   baseMater[0];
                    getOtherNonBaseMaterials(function (err, otherMats) {
                        finalStat.otherMaterials = otherMats;
                        finalStat.isOthersAssigned = 0;
                        callback(err, finalStat);
                    })
                });
            });
        }
    });
}

exports.updateBaseMaterialForAdd =   function (materialData, callback) {
    var materialId  =   materialData.baseMaterialId;
    var obj =   {
        isBaseMaterial:0,
        baseLength:0,
        baseBreadth:0,
        baseHeight:0,
        materialCost:0,
        l_ratio:0,
        b_ratio:0,
        h_ratio:0,
        quality_percentage:""

    };
    connection.executeQuery("update materials set ? where isBaseMaterial=1",[obj],function (err, status) {
        connection.executeQuery("delete from materialcost",[],function (err, status) {
            obj = {
                isBaseMaterial: 1,
                baseLength: materialData.baseLength,
                baseBreadth: materialData.baseBreadth,
                baseHeight: materialData.baseHeight,
                materialCost: materialData.materialCost,
                l_ratio:materialData.l_ratio,
                b_ratio:materialData.b_ratio,
                h_ratio:materialData.h_ratio,
                quality_percentage:materialData.quality_percentage
            };
            connection.executeQuery("update materials set ? where pkMaterialId=?", [obj, materialId], function (err, status) {
                callback(err, status);
            });
        });
    });
};

exports.addOtherMaterialsPercentage =   function (baseMaterial, otherMaterialId, percentage, callback) {
    var obj =   {
        fkMaterialId:otherMaterialId,
        fkBaseMaterialId:baseMaterial,
        percentage:percentage
    }
    connection.executeQuery("insert into materialcost set ? ", [obj], function (err, status) {
        callback(err, status);
    });
};

exports.getMaterialCostMgmt =   function (callback) {
    var finalStat={};
    finalStat.isOthersAssigned      =   0;
    connection.executeQuery("select * from materials where isBaseMaterial=1",[],function (err, materials) {
        if(!err && materials != undefined && materials.length >0) {
            finalStat.fkBaseMaterial  =   materials[0];
            finalStat.fkBaseMaterialId  =   materials[0].pkMaterialId;
            connection.executeQuery("select mc.*,mat.* from materialcost as mc left join materials as mat on mat.pkMaterialId=mc.fkMaterialId", [], function (err, status) {
                if(status != undefined && status.length > 0) {
                    finalStat.otherMaterials = status;
                    finalStat.isOthersAssigned      =   1;
                    callback(err, finalStat);
                }else{
                    getOtherNonBaseMaterials(function (err, stat) {
                        finalStat.otherMaterials = stat;
                        finalStat.isOthersAssigned      =   0;
                        callback(err, finalStat);
                    })
                }
            });
        }else{
            callback(true,"No Base Material Selected");
        }
    });
}

exports.getBaseMaterial =   function (callback) {

    connection.executeQuery("select * from materials where isBaseMaterial=1", [], function (err, materials) {
        callback(err,materials);
    });
}

var getOtherNonBaseMaterials    =   function (callback) {
    connection.executeQuery("select * from materials where isBaseMaterial=0",[],function (err, materials) {
        callback(err,materials);
    })
}