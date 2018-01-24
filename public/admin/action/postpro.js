/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isPPEdit  =   false;
    var selectedMaterial = -1;
    var availability = "";

    var host    =   window.location.protocol+"//"+window.location.host;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/adminpostprocess?id=") != -1){
        isPPEdit = true;
        selectedMaterial = $("#selectPPMaterialLbl").attr('ppmatid');
        availability    =   $("#ppAvailability").attr('ppavail');
        $("#selectPPAvailability").val(""+availability).trigger('change');
        getMaterials();
        $("#selectPPMaterial").val(""+selectedMaterial).trigger('change');
    }else if(currentPath.indexOf("/admin/adminpostprocess") != -1){
        isPPEdit = false;
        getMaterials();
    }

    function getMaterials() {
        $.ajax({
            url:'/admin/materials/getallmaterials',
            type:'GET',
            success:function (categoryResult) {
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildMaterialsForPP(categories);
                }
            }
        });
    }

    function buildMaterialsForPP(materials) {
        $("#selectPPMaterial").empty()
        var categoriesForm  =   "";
        for(var i=0;i<materials.length;i++) {
            console.log(materials[i])
            var currentMaterial = materials[i];
            var pkMaterialId    = currentMaterial.pkMaterialId;
            var isBasematerial  = currentMaterial.isBaseMaterial;
            var selected = '';
            if(selectedMaterial == (""+pkMaterialId)){
                selected = 'selected';
            }else {
                selected = '';
            }
            categoriesForm+="<option "+selected+" value='"+pkMaterialId+"' isbase='"+isBasematerial+"'>"+currentMaterial.materialName+"</option>"
        }
        $("#selectPPMaterial").append(categoriesForm);

    }
    
    $("#ppInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){

                updatePP();
        }else {

                addNewPP();
            }
    });


    function updatePP() {
        var processName =   $("#process_name").val();
        var materialId  =   $("#selectPPMaterial option:selected").val();//selectPPMaterial
        var availabllity =   $("#selectPPAvailability option:selected").val(); //selectPPAvailability
        var cost              =   $("#cost_percentage").val();
        var disc              =   $("#discount_percentage").val();
        var final              =   $("#final_cost_percentage").val();
        var id = $("#ppInsert").attr('ppid');
        //pk_post_process_id
        var productObj  =   {
            pk_post_process_id:id,
            fk_material_id:materialId,
            process_name: processName,
            availability: availabllity,
            cost_percentage: cost,
            discount_percentage:disc,
            final_cost_percentage:final
        };
        console.log(productObj);
        $.ajax({
            url: '/admin/postpro/updatepostpro',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/adminpostprocess';
                }
            }
        });
    }
    function addNewPP() {
        var processName =   $("#process_name").val();
        var materialId  =   $("#selectPPMaterial option:selected").val();//selectPPMaterial
        var availabllity =   $("#selectPPAvailability option:selected").val(); //selectPPAvailability
        var cost              =   $("#cost_percentage").val();
        var disc              =   $("#discount_percentage").val();
        var final              =   $("#final_cost_percentage").val();

        var ppObj  =   {
            //productInfo: {
            fk_material_id:materialId,
            process_name: processName,
            availability: availabllity,
            cost_percentage: cost,
            discount_percentage:disc,
            final_cost_percentage:final
            //}
        };
        console.log(ppObj)
        $.ajax({
            url: '/admin/postpro/addpostpro',
            type: 'POST',
            dataType: 'json',
            data: ppObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    window.location.reload();
                }
            }
        });
    }


    $("#viewPostPro").click(function (e) {
        //alert("h")
        $.ajax({
            url:'/admin/postpro/getallpostpro',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    });

    function buildPostProListUI(postPros) {
        console.log(postPros)
        var form    =   "";
        $("#post-product-list-container").empty();
        for(var i=0;i<postPros.length;i++){
            var ppId   =   postPros[i].pk_post_process_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<tr><td>"+(i+1)+"<td>"+postPros[i].process_name+
                "<td>"+postPros[i].materialName+"<td>"+postPros[i].availability+
                "<td>"+postPros[i].cost_percentage+"<td>"+postPros[i].discount_percentage+
                "<td>"+postPros[i].final_cost_percentage+
                    "<td><a href='/admin/adminpostprocess?id="+postPros[i].pk_post_process_id+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  </td>"+
                "</tr>";
        }
        $("#post-product-list-container").append(form);

    }


});