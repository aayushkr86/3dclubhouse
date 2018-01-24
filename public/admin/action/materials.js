/**
 * Created by anooj on 01/07/17.
 */

$('document').ready(function () {

    let otherMatContainers  =   $("#cost-other-materials-container");
    let otherMatOnlyContainers  =   $("#cost-gen-material");
    let updateBaseMatId     =   $("#cost-update-basematerial");
    let baseMaterialSelId   =   $("#cost-selectMaterial");
    let insertCostId        =   $("#materialcostInsert");
    let apiEndPoints    =   {
        getMaterialCost:'/admin/materials/getmaterialcostmgmt',
        updateBaseMaterialOnly:'/admin/materials/updatebasematerial',
        addMaterialCost:'/admin/materials/addmaterialcostmgmt'
    };

    init();
    function init() {
        otherMatContainers.hide();
        getMaterialCost();
    }


    updateBaseMatId.click(function () {
        updateBaseMaterialOnly();
    });

    insertCostId.click(function () {
        var obj={};
        var otherMaterials=[];
        var isError=false;
        $('.percent-value').each(function(){
            console.log($(this).val());
            console.log($(this).attr("basemat"));
            console.log($(this).attr("currentmat"));
            if($(this).val() == "" || $(this).val() == null){
                isError =   true;
            }
            var other_mat   =   {
                materialId:$(this).attr("currentmat"),
                percentage:$(this).val()
            }
            obj.baseMaterialId  =   $(this).attr("basemat");
            otherMaterials.push(other_mat);
        });
        obj.otherMaterials=JSON.stringify(otherMaterials);
         obj.baseLength =   parseFloat($("#cost-length").val());
             obj.baseBreadth    =   parseFloat($("#cost-breadth").val());
             obj.baseHeight =   parseFloat($("#cost-height").val());
             obj.materialCost   =   parseFloat($("#cost-mat").val());
        if(obj.baseLength == "" || obj.baseBreadth == "" || obj.baseHeight == "" || obj.materialCost == ""){
            isError=true;
        }

        var perc=[];
        var values_ = $('.q_perc').map(function() {
            console.log($(this).attr("id"))
            var id=$(this).attr("id");
            var val =   $(this).val();
            if(val == ""){
                isError =   true;
            }
            var _obj={}
            _obj[id] =   parseFloat(val);
            perc.push(_obj)
            return _obj;
        }).get();

        obj.quality_percentage  =   JSON.stringify(perc);
        if(!isError){
            //


            RatioCalc(obj.baseLength,obj.baseBreadth,obj.baseHeight,function (l_ratio, b_ratio, h_ratio) {
                obj.l_ratio =   l_ratio;
                obj.b_ratio =   b_ratio;
                obj.h_ratio =   h_ratio;

                console.log("Updated: ",obj);
                addMaterialCost(obj);
            });
         }else {
             alert("Fill all fields")
         }

        //console.log(obj);

    });

    function RatioCalc(l, b, h, callback){
        var A = l;
        var B = b;
        var C = h;

        var X = B/A;
        var Y = C/A;
        var Q = "1 : "+X+" : "+Y;
        callback(1,X,Y);
    }

    var _cost   =   "";
    $("#cost-mat").on("change keyup",function() {
       console.log($(this).val());
       _cost    =   $(this).val();


       $(".currentcost").text(_cost)
        $(".currentcost").html(_cost)
    });

    $("#quality_num").on("change keyup",function () {
       qualityManagement();
    });

    function qualityManagement(){
        $("#quality_nums").empty();
        let numQuality  =   $("#quality_num").val();
        var form    =   "";
        for(var i=0;i<numQuality;i++){
            var _i  =   i+1;
            var placeholder =   "Percentage";
            if(_i == 1){
                placeholder =   "Percentage (Base Quality)";
            }
            form+='<div class=form-group><label categoryid="" categoryname="" ' +
                'class="col-sm-2 control-label" for=selectCategory id=fkCategoryId>Quality '+_i+' =</label>' +
                '<div class=col-sm-3><input class="form-control q_perc" id="quality_'+_i+'"' +
                'placeholder="'+placeholder+'" type=number> <span>% Of </span><span class=currentcost>'+_cost+'</span></div>' +
                '<div class=col-sm-5></div></div>'
        }
        $("#quality_nums").append(form);
    }


    function addMaterialCost(costObj) {
        $.ajax({
            url:apiEndPoints.addMaterialCost,
            type:'POST',
            data:costObj,
            success:function (data) {
                console.log("MaterialAdd: ",data);
                if(data.success){
                    alert("Successfully updated")
                }
            }
        })
    }

    function getMaterialCost() {
        $.ajax({
            url:apiEndPoints.getMaterialCost,
            type:'GET',
            success:function (data) {
                console.log("MaterialCost: ",data);
                if(data.success == true) {
                    var matData =   data.data;
                    verifyOtherAssigned(matData.isOthersAssigned,matData.otherMaterials,matData.fkBaseMaterialId,matData.fkBaseMaterial);
                }
            }
        })
    }

    function updateBaseMaterialOnly() {
        let materialId  =   $("#cost-selectMaterial option:selected").val();
        $.ajax({
            url:apiEndPoints.updateBaseMaterialOnly,
            type:'POST',
            data:{baseMaterialId:materialId},
            success:function (data) {
                console.log("UpdateMaterialBase: ",data);
                if(data.success == true) {
                    var matData =   data.data;
                    verifyOtherAssigned(matData.isOthersAssigned,matData.otherMaterials,matData.fkBaseMaterialId,matData.fkBaseMaterial);
                }
            }
        })
    }

    function verifyOtherAssigned(isAssigned,costData,baseMaterialId,baseMaterial) {
        var materialName    =   "";
        if(baseMaterialId != null){
            baseMaterialSelId.val(baseMaterialId);
            materialName  =   $("#cost-selectMaterial option:selected").text();
        }
        if(isAssigned == 0){
            otherMatOnlyContainers.empty();
            var form="";
            for(var i=0;i<costData.length;i++){
                form+='<div class=form-group>' +
                    '<label categoryid=""categoryname="" ' +
                    'class="control-label col-sm-2"for=selectCategory id=fkCategoryId>'+costData[i].materialName+' = </label>' +
                    '<div class=col-sm-3><input class="form-control percent-value" basemat="'+baseMaterialId+'" currentmat="'+costData[i].pkMaterialId+'" id=percentage placeholder=Percentage>' +
                    '</div><div class=col-sm-5><label categoryid=""categoryname="" ' +
                    'class="control-label col-sm-4"for=selectCategory id=fkCategoryId>% of '+materialName+'</label>' +
                    '</div></div>';
            }
            otherMatOnlyContainers.append(form);
            otherMatContainers.show();
        }else{
            otherMatOnlyContainers.empty();
            var form="";
            for(var i=0;i<costData.length;i++){
                form+='<div class=form-group>' +
                    '<label categoryid=""categoryname="" ' +
                    'class="control-label col-sm-2"for=selectCategory id=fkCategoryId>'+costData[i].materialName+' = </label>' +
                    '<div class=col-sm-3><input class="form-control percent-value" basemat="'+baseMaterialId+'" currentmat="'+costData[i].pkMaterialId+'" value="'+costData[i].percentage+'" id=percentage placeholder=Percentage>' +
                    '</div><div class=col-sm-5><label categoryid=""categoryname="" ' +
                    'class="control-label col-sm-4"for=selectCategory id=fkCategoryId>% of '+materialName+'</label>' +
                    '</div></div>';
            }
            otherMatOnlyContainers.append(form);
            otherMatContainers.show();
            if(baseMaterial != undefined && baseMaterial.pkMaterialId != undefined){
                $("#cost-height").val(baseMaterial.baseHeight);
                $("#cost-length").val(baseMaterial.baseLength);
                $("#cost-breadth").val(baseMaterial.baseBreadth);
                $("#cost-mat").val(baseMaterial.materialCost);
                var qualities   =   baseMaterial.quality_percentage;
                qualities       =   JSON.parse(qualities);
                $("#quality_num").val(qualities.length);
                _cost   =   baseMaterial.materialCost;
                qualityManagement();
                for(var i=0;i<qualities.length;i++){
                    var eachObj =   qualities[i];
                    var keys = Object.keys(eachObj);
                    if(keys.length > 0){
                        $("#"+keys[0]).val(eachObj[keys[0]]);
                    }
                }
            }
        }
    }

});