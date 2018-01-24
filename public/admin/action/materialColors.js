/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {

    var isNewImageSelected  =   false;
    var materialEditMode = false;
    var avSelectedColors = [];
    var imageDeleted    =   false;
    var isEdit  =   false;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/adminmaterials?mat=") != -1){
        isEdit  =   $("#materials-submit").attr("isEdit");
        materialEditMode = true;
        var colors = $("#avMaterialColors").attr("avcolors");
        if(colors != ""){
            colors = JSON.parse(colors);
            console.log("COLORS: ",colors);
            for(var i=0;i<colors.length;i++){
                avSelectedColors.push(colors[i].fk_color_id);
            }
        }
    }
    if(currentPath.indexOf("/admin/admincolors?col=") != -1){
        isEdit  =   $("#color-submit").attr("isEdit");
    }

    getMaterials();
    getColors();


    $("#materials-submit").click(function () {
        isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
                updateMaterial();
        }else {
                addNewMaterial();
        }

    });

    $("#color-submit").click(function () {
        isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
            updateColor();
        }else {
            addNewColor();
        }

    });


    function updateColor() {
        var colorName    =   $("#colorName").val();
        var colorHex    =   $("#colorHex").val();
        var colorObj     =   {
            colorName:colorName,
            colorHex:colorHex
        };

        var catId   =   $("#color-submit").attr("colorId");
        colorObj.pkColorId    =   catId;
        $.ajax({
            url: '/admin/colors/updatecolor',
            type: 'POST',
            data: colorObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully updated");
                        window.location.href    =   '/admin/admincolors';
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }
    function updateMaterial() {
        var materialName    =   $("#materialName").val();
        var materialPrice   =   $("#materialCost").val();
        var materialWeight  =   $("#materialWeight").val();
        var materialDesc    =   $("#materialDesc").val();
        var colors = [];
        $("input:checkbox[name=chk_group]:checked").each(function(){
            colors.push($(this).val());
        });

        var materialObj     =   {
            materialName:materialName,
            materialName:materialName,
            materialWeight:materialWeight,
            materialCost:materialPrice,
            materialDesc:materialDesc,
            colors:JSON.stringify(colors)

        };

        var catId   =   $("#materials-submit").attr("materialId");
        materialObj.pkMaterialId    =   catId;
        $.ajax({
            url: '/admin/materials/updatematerial',
            type: 'POST',
            data: materialObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully updated");
                        window.location.href    =   '/admin/adminmaterials';
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }
    function addNewMaterial() {
        var materialName    =   $("#materialName").val();
        var materialPrice   =   $("#materialCost").val();
        var materialWeight  =   $("#materialWeight").val();
        var materialDesc    =   $("#materialDesc").val();
        var colors = [];
        $("input:checkbox[name=chk_group]:checked").each(function(){
            colors.push($(this).val());
        });

        var materialObj     =   {
            materialName:materialName,
            materialWeight:materialWeight,
            materialCost:materialPrice,
            materialDesc:materialDesc,
            colors:JSON.stringify(colors)
        };
        console.log(materialObj);
        $.ajax({
            url: '/admin/materials/addmaterial',
            type: 'POST',
            data: materialObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully added");
                        $("#materialName").val("");
                        window.location.reload();
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }
    function addNewColor() {
        var colorName    =   $("#colorName").val();
        var colorHex = $("#colorHex").val();

        var colorObj     =   {
            colorName:colorName,
            color_hex:colorHex
        };
        $.ajax({
            url: '/admin/colors/addcolor',
            type: 'POST',
            data: colorObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully added");
                        $("#colorName").val("");
                        window.location.reload();
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }


    $("#view-all-materials-list").click(function (e) {
       getMaterials();
    });

    $("#view-all-colors-list").click(function (e) {
        getColors();
    });


    function getColors() {
        $.ajax({
            url:'/admin/colors/getallcolors',
            type:'GET',
            success:function (categoryResult) {
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildColorsList(categories);
                    showAvColorsList(categories);
                }
            }
        });
    }

    function showAvColorsList(colors) {
        var form = '';
        $("#avMaterialColors").empty();
        for(var i=0;i<colors.length;i++){
            var currentCategory =   colors[i];
            var colorId  =   currentCategory.pkColorId;
            var hex =   currentCategory.color_hex;
            var style= '';
            if(hex != null && hex != undefined){
                if(hex.indexOf("#") != -1){
                    style = hex;
                }else{
                    style = "#"+hex;
                }

            }
            form += '<span style="margin-right: 10px"> <input id="av_'+colorId+'" type="checkbox" name="chk_group" value="'+colorId+'"/><label style="'+style+'">'+currentCategory.colorName+'</label><input disabled style="margin-left:5px;background-color: '+style+';width:30px" class="jscolor"> </span>'
        }
        $("#avMaterialColors").append(form);
        if(materialEditMode){
            setSelectedMatColor();
        }
    }

    function setSelectedMatColor() {
        for(var i=0;i<avSelectedColors.length;i++){
            $("#av_"+avSelectedColors[i]).attr("checked",true);
        }
    }

    function buildColorsList(colors) {
        var categoriesForm  =   "";
        $("#color-list-container").empty();
        for(var i=0;i<colors.length;i++){
            console.log(colors[i])
            var currentCategory =   colors[i];
            var categoryId  =   currentCategory.pkColorId;

            categoriesForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+currentCategory.colorName+"</td>"+
                "<td><a class='btn btn-default' href='/admin/admincolors?col="+categoryId+"'><i class='fa fa-fw fa-edit'></i></a></td>";
        }
        $("#color-list-container").append(categoriesForm);
    }

    function getMaterials() {
        $.ajax({
            url:'/admin/materials/getallmaterials',
            type:'GET',
            success:function (categoryResult) {
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildMaterialsList(categories);
                    buildMaterialsForCostMgmt(categories);
                }
            }
        });
    }
    function buildMaterialsList(materials) {
        var categoriesForm  =   "";
        $("#material-list-container").empty();
        for(var i=0;i<materials.length;i++){
            console.log(materials[i])
            var currentCategory =   materials[i];
            var pkMaterialId  =   currentCategory.pkMaterialId;

            categoriesForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+currentCategory.materialName+"</td>"+
                "<td><a class='btn btn-default' href='/admin/adminmaterials?mat="+pkMaterialId+"'><i class='fa fa-fw fa-edit'></i></a></td>";
        }
        $("#material-list-container").append(categoriesForm);
    }
    function buildMaterialsForCostMgmt(materials) {
        $("#cost-selectMaterial").empty();
        //$("#selectPPMaterial").empty()
        var categoriesForm  =   "";
        for(var i=0;i<materials.length;i++) {
            console.log(materials[i])
            var currentMaterial = materials[i];
            var pkMaterialId    = currentMaterial.pkMaterialId;
            var isBasematerial  = currentMaterial.isBaseMaterial;
            categoriesForm+="<option value='"+pkMaterialId+"' isbase='"+isBasematerial+"'>"+currentMaterial.materialName+"</option>"
        }
        $("#cost-selectMaterial").append(categoriesForm);
        //$("#selectPPMaterial").append(categoriesForm);

    }

    $('body').on('click','.deletecat',function () {
        var categoryId  =   $(this).attr("id");
        $.ajax({
            url:'/admin/categories/deletecategory',
            type:'POST',
            data:{pkCategoryId:categoryId},
            success:function (categoryResult) {
                console.log(categoryResult)
                var data    =   categoryResult;
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully deleted");
                        window.location.reload();
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to delete");
                }
            }
        });
    });


    $('#category-img-delete').click(function() {
        $("#cat-uploaded-img-container").empty();
        imageDeleted    =   true;
        $("#category-img-upload-container").show();
    });
});