/**
 * Created by anooj on 06/05/17.
 */
var materialManager =   require('../dataAccessLayer/materialDA');

exports.getAllMaterials    =   function (callback) {
    materialManager.getAllMaterials(function (err, materials) {
        callback(err, materials);
    });
}

exports.getAllNonBaseMaterials    =   function (callback) {
    materialManager.getAllNonBaseMaterials(function (err, materials) {
        callback(err,materials);
    })
};

exports.getMaterialsFromId =   function (materialId,callback) {
    materialManager.getMaterialsFromId(materialId,function (err, materials) {
        if(!err && materials != undefined && materials.length > 0){
            materialManager.getMaterialColors(materialId,function (err, colors) {
                materials[0].colors = colors;
                callback(err,materials);
            })
        }else {
            callback(err, materials);
        }
    });
};

exports.getMaterialColors = function (materialId, callback) {
    materialManager.getMaterialsFromId(materialId,function (err, materials) {
        callback(err,materials);
    });
}

exports.addMaterial =   function (materialData, callback) {
    var colorIds = materialData.colors;
    delete materialData["colors"];
    colorIds = JSON.parse(colorIds);
    materialManager.addMaterial(materialData,function (err, material) {
        if(!err && material != null && material.insertId != undefined) {
            materialManager.addColorsToMaterial(colorIds, material.insertId, function (error, stat) {
                callback(err, material);
            })
        }else{
            callback(err, material);
        }

    });
};

exports.updateMaterial =   function (materialData, callback) {
    var colorIds = materialData.colors;
    delete materialData["colors"];
    colorIds = JSON.parse(colorIds);
    materialManager.updateMaterial(materialData,function (err, material) {
        materialManager.deleteAllMaterialColors(materialData.pkMaterialId,function (err, st) {
            materialManager.addColorsToMaterial(colorIds,materialData.pkMaterialId,function (err, stat) {
                callback(err,material);
            });
        });
    });
};

exports.updateBaseMaterial =   function (materialData, callback) {
    materialManager.updateBaseMaterialOnly(materialData,function (err, material) {
        callback(err,material);
    });
};

exports.addMaterialCostMgmt =   function (materialData, callback) {
    console.log(materialData)
    materialManager.updateBaseMaterialForAdd(materialData,function (err, status) {
        let async   =   require('async');
        let otherMaterials  =   JSON.parse(materialData.otherMaterials);
        let fkBaseMaterialId    =   materialData.baseMaterialId;
        var otherStat   =   [];
        async.eachSeries(otherMaterials,function (eachOthers, finish) {
            var fkMaterialId  =   eachOthers.materialId;
            var percentage    =   eachOthers.percentage;

            materialManager.addOtherMaterialsPercentage(fkBaseMaterialId,fkMaterialId,percentage,function (err, data) {
                otherStat.push(data);
                finish();
            })
            
        },function (done) {
            callback(err,otherStat);
        })
    })
};

exports.getMaterialCostMgmt =   function (callback) {
    materialManager.getMaterialCostMgmt(function (err, status) {
        callback(err,status);
    });
}

exports.getBaseMaterial =   function (callback) {
    materialManager.getBaseMaterial(function (err, status) {
        callback(err,status);
    });
}