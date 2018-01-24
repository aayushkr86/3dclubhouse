/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isEdit  =   false;
    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var isSTLFound = false;
    var productImagesArray=[];
    var productArray    =   [];
    var productIdsArray    =   [];
    var deletedIds  =   [],addedImages=[];
    var isNewImageSelected  =   false;
    var imageDeleted    =   false;
    var materialCost    =   {};

    var host    =   window.location.protocol+"//"+window.location.host;
    getRecentProducts();
    getCounts();


    var currentPath =   window.location.pathname + window.location.search

    if(currentPath.indexOf("/admin/adminproducts") != -1){
        getMaterials();
        getFixedSlicers();
    }

    if(currentPath.indexOf("/admin/adminproducts?id=") != -1){
        //setTimeout(function () {
            var isEdit  =   $("#productInsert").attr("isEdit");
            console.log("Found product info", host)
            console.log($("#productimg-loaded").attr("productimages"));
            productArray = $("#productimg-loaded").attr("productimages");
            if (productArray != undefined && productArray.length > 0) {
                $("#existingImages-container").show();
                productArray = JSON.parse(productArray);
                console.log(productArray)

                $("#existingImages").empty();
                var imageForm = "";
                for (var i = 0; i < productArray.length; i++) {
                    var imageName = productArray[i].productImage;
                    productIdsArray.push(productArray[i].pkProductImageId);
                    imageForm += "<div id='container-"+productArray[i].pkProductImageId+"' class='col-sm-2 img-col'> <div class='img-wrap'> " +
                        "<span id='"+productArray[i].pkProductImageId +"' class='close productimage-close'>×</span> " +
                        "<img class='img-wrap_responsive' src='" + imageName + "' data-id='" + productArray[i].pkProductImageId + "'> " +
                        "</div></div>";
                }
                $("#existingImages").append(imageForm);
            }else{
                $("#existingImages-container").hide();
            }
        //},2000);
    }else{
        $("#existingImages-container").hide();
    }
    var uploader    =   $("#productImagesArray").uploadFile({
        url: '/admin/product/uploadproductimages',
        allowedTypes: "jpg,png,gif,bmp,jpeg,stl",
        fileName:"uploadfile",
        multiple: true,
        showCancel:true,
        showAbort:false,
        showDelete:true,
        showFileSize:true,
        autoSubmit:false,
        cancelStr:"Delete",
        serialize:true,
        showPreview:true,
        previewWidth:"50%",
        previewHeight:"50%",
        onSuccess: function (files, data, xhr)
        {
            $("#status").html("<font color='green'>Upload is successful</font>");
            //var str=document.getElementById("output").value;
            //document.getElementById("output").value=;
            console.log("UPLOAD DATA .. ")
            console.log(data)
            console.log(files)
            productImagesArray.push(data[0]);
            if(isEdit == true || isEdit == 'true'){
                addedImages.push(data[0]);
            }
            //
        },
        onSelect: function (files) {
            console.log("Select: ",files)
            isNewImageSelected  =   true;
            isSTLFound = false;
            for(var i=0;i<files.length;i++){
                console.log(files[i].type);
                if(files[i].type.indexOf("stl") != -1){
                    isSTLFound = true;
                }
            }
            console.log("isSTL: ",isSTLFound)
            return true;
        },
        afterUploadAll: function ()
        {
            //alert("all images uploaded!!");

            console.log("trtrtrtrr");
            if(isEdit == true || isEdit == 'true'){
                updateProduct();
            }else{
                addnewProduct();
            }

        },
        onError: function (files, status, errMsg)
        {
            $("#divLoading").removeClass('show');
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    });
    function getMaterialCost() {
        $.ajax({
            url:"/admin/materials/getmaterialcostmgmt",
            type:'GET',
            success:function (data) {
                console.log("MaterialCost: ",data);
                if(data.success == true) {
                    var matData =   data.data;
                    materialCost    =   (matData.fkBaseMaterial);
                }
            }
        })
    }
    $("#productInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
            if(isNewImageSelected){
                if(isSTLFound) {

                    uploader.startUpload();

                }else {
                    alert("STL File not found");
                }
            }else {
                updateProduct();
            }
        }else {
            if(isNewImageSelected) {
                if(isSTLFound) {
                    $("#divLoading").addClass('show');
                    uploader.startUpload();
                }
            }
            // else{
            //     addnewProduct();
            // }
        }
    });



    function updateProduct() {
        var productName =   $("#productName").val();
        var productDesc =   $("#productDesc").val();
        var productMinLength    =   $("#productMinLength").val();
        var productMinHeight    =   $("#productMinHeight").val();
        var productMinBreadth   =   $("#productMinBreadth").val();
        var productMinPrice     =   $("#productMinPrice").val();
        var catId              =   $("#selectCategory option:selected").val();
        var productObj  =   {
            productName: productName,
            productDesc: productDesc,
            minLength: productMinLength,
            minHeight: productMinHeight,
            minBreadth: productMinBreadth,
            minPrice: productMinPrice,
            deletedImages:JSON.stringify(deletedIds),
            addedImages:JSON.stringify(addedImages),
            fkCategoryId:catId
        };
        var productId   =   $("#productInsert").attr("productId");
        productObj.pkProductId  =   productId;
        console.log(productObj);
        $.ajax({
            url: '/admin/product/updateproduct',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/adminproducts';
                }
            }
        });
    }
    function addnewProduct() {
        var isEdit  =   $("#productInsert").attr("isEdit");
        var productName =   $("#productName").val();
        var productDesc =   $("#productDesc").val();
        var productMinLength    =   $("#productMinLength").val();
        var productMinHeight    =   $("#productMinHeight").val();
        var productMinBreadth   =   $("#productMinBreadth").val();
        var productMinPrice     =   $("#productMinPrice").val();
        var productFilament     =   $("#productFilament").val();
        var productMinCoefficient     =   $("#productMinCoefficient").val();
        var productMaxCoefficient     =   $("#productMaxCoefficient").val();
        var productStrength     =   $("#productStrength").val();
        var productVariableCode     =   $("#selectVariableCode option:selected").val();
        var productMaterialId   =   $("#selectMaterial option:selected").val();
        var productDefPP    =   $("#selectPPId option:selected").val();
        var productPrintTime     =   $("#productPrintTime").val();
        var catId              =   $("#selectCategory option:selected").val();

        var productObj  =   {
            //productInfo: {
            productName: productName,
            productDesc: productDesc,
            productMinLength: productMinLength,
            productMinHeight: productMinHeight,
            productMinBreadth: productMinBreadth,
            productMinPrice: productMinPrice,
            productImages: JSON.stringify(productImagesArray),
            productFilament:productFilament,
            productMinCoefficient:productMinCoefficient,
            productMaxCoefficient:productMaxCoefficient,
            productStrength:productStrength,
            productVariableCode:productVariableCode,
            productPrintTime:productPrintTime,
            productMaterialId:productMaterialId,
            productDefPP:productDefPP,
            fkCategoryId:catId
            //}
        };
        console.log(productObj);
        $.ajax({
            url: '/admin/product/addproduct',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                $("#divLoading").removeClass('show');
                console.log(data);
                if (data.success == true) {
                    window.location.reload();
                }
            },
            error:function () {
                $("#divLoading").removeClass('show');
            }
        });
    }



    $("#view-products").click(function (e) {
        $.ajax({
            url:'/admin/product/getallproducts',
            type:'GET',
            success:function (data) {
                buildProductListUI(data.data);
            }
        })
    });

    function getCategories() {
        $.ajax({
            url:'/admin/categories/getallcategories',
            type:'GET',
            success:function (categoryResult) {
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildCategoriesList(categories);
                }
            }
        });
    }
    function buildProductListUI(products) {
        console.log(products)
        var form    =   "";
        $("#product-list-container").empty();
        for(var i=0;i<products.length;i++){
            var productId   =   products[i].pkProductId;
            console.log(JSON.stringify(products[i]))
            form+="<tr><td>"+(i+1)+"<td>"+products[i].productName+
                "<td>"+products[i].categoryName+"<td>"+products[i].productDesc+"<td>"
                +products[i].minLength+" "+products[i].minBreadth+" "+products[i].minHeight+"<td>" +
                products[i].minPrice+"</td>" +
                    "<td><a href='/admin/adminproducts?id="+products[i].pkProductId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  <button class='deleteprod btn btn-danger btn-small' id="+productId+" data-tid='13046'><i class='fa fa-fw fa-times'></i></button></td>"+
                "</tr>";
        }
        $("#product-list-container").append(form);

    }


    function buildCategoriesList(categories) {
        var categoriesForm  =   "";
        $("#category-list-container").empty();
        for(var i=0;i<categories.length;i++){
            console.log(categories[i])
            var currentCategory =   categories[i];
            var categoryDesc    =   currentCategory.categoryDesc;
            var categoryUnique  =   currentCategory.categoryUnique;
            var categoryImage   =   currentCategory.categoryImage;

            if(currentCategory.categoryDesc == "" || currentCategory.categoryDesc == null){
                categoryDesc    =   "No description found";
            }
            if(currentCategory.categoryUnique == "" || currentCategory.categoryUnique == null){
                categoryUnique    =   "No unique name added";
            }
            if(currentCategory.categoryImage == "" || currentCategory.categoryImage == null){
                categoryImage    =   "No image added";
            }

            categoriesForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+currentCategory.categoryName+
                "<td>"+categoryUnique+
                "<td>"+categoryDesc+
                "<td>"+categoryImage+
                "<td><a class='btn btn-default'href=#><i class='fa fa-fw fa-edit'></i></a> <button class='btn btn-danger btn-small'data-tid=13046 id=dlt_user><i class='fa fa-fw fa-times'></i></button> <a class='btn btn-success'href=# target=_blank><i class='fa fa-fw fa-print'></i></a>";
        }
        $("#category-list-container").append(categoriesForm);
    }

    $('body').on('click','.deleteprod',function () {
        var productId  =   $(this).attr("id");
        $.ajax({
            url:'/admin/product/deleteproduct',
            type:'POST',
            data:{pkProductId:productId},
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
    })

    function getRecentProducts() {
        $.ajax({
            url: '/admin/product/getrecentproducts',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    var products    =   data.data;
                    buildRecentProducts(products);
                }
            }
        });
    }
    function getFixedSlicers() {
        $.ajax({
            url:'/admin/fixedslicer/getallfixedslicer',
            type:'GET',
            success:function (data) {
                buildFixedSlicer(data.data);
            }
        })
    }

    function buildFixedSlicer(fsData) {
        $("#selectVariableCode").empty();
        var form = '';
        for(var i=0;i<fsData.length;i++){
            var id = fsData[i].pk_fixed_id;
            var data = fsData[i].variable_code;
            form += '<option quality="'+fsData[i].quality+'" strength="'+fsData[i].strength+'" value="'+id+'">'+data+'</option>';
        }
        $("#selectVariableCode").append(form);
        updateStrengthAndQualityValue();
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
        $("#selectMaterial").empty()
        var categoriesForm  =   "";
        for(var i=0;i<materials.length;i++) {
            console.log(materials[i])
            var currentMaterial = materials[i];
            var pkMaterialId    = currentMaterial.pkMaterialId;
            var isBasematerial  = currentMaterial.isBaseMaterial;
            var selected = '';

            categoriesForm+="<option value='"+pkMaterialId+"' isbase='"+isBasematerial+"'>"+currentMaterial.materialName+"</option>"
        }
        $("#selectMaterial").append(categoriesForm);
        loadPostProcessingOfMaterial();

    }

    function buildPostPro(fsData) {
        $("#selectPPId").empty();
        var form = '';
        for(var i=0;i<fsData.length;i++){
            var id = fsData[i].pk_post_process_id;
            var data = fsData[i].process_name;
            form += '<option value="'+id+'">'+data+'</option>';
        }
        $("#selectPPId").append(form);
    }


    $('#selectVariableCode').on('change', function() {
        //alert( this.value );
        updateStrengthAndQualityValue();
    });

    //selectMaterial
    $('#selectMaterial').on('change', function() {
        var materialId = $(this).val();
        loadPostProcessingOfMaterial();
    });

    function loadPostProcessingOfMaterial() {
        var matId = $("#selectMaterial option:selected").val();
        $.ajax({
            url:'/admin/postpro/getpostprofrommaterial',
            type:'POST',
            data:{fk_material_id:matId},
            success:function (data) {
                buildPostPro(data.data)
            }
        })
    }

    function updateStrengthAndQualityValue() {
        var quality =   $("#selectVariableCode option:selected").attr('quality');
        var strength =   $("#selectVariableCode option:selected").attr('strength');
        $("#productQuality").val(quality);
        $("#productStrength").val(strength);
    }

    function getCounts() {
        $.ajax({
            url: '/admin/getadmincounts',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log("COUNTS: ",data);
                console.log("COUNTS: ",data.length);
                if(data.length == 4){
                    $("#count-products").text(data[0].counts)
                    $("#count-cats").text(data[1].counts)
                    $("#count-orders").text(data[3].counts)
                    $("#count-users").text(data[2].counts)

                }
            }
        });
    }

    function buildRecentProducts(products) {
        $("#recent-prooducts").empty();
        var form    =   "";
        for(var i=0;i<products.length;i++){
            form+="<li class='item'> <div class='product-img'> " +
                "<img src='/admin/dist/img/default-50x50.gif' alt='Product Image'> </div>" +
                "<div class='product-info'> " +
                "<a href='javascript:void(0)' class='product-title'>"+products[i].productName +
                "<span class='label label-warning pull-right'>"+products[i].minPrice+" INR</span></a> " +
                "<span class='product-description'>"+products[i].categoryName+"</span> </div></li>";
        }
        $("#recent-prooducts").append(form);
    }

    $(".productimage-close").click(function (e) {
        var imageId =   ($(this).attr('id'));
        imageDeleted    =   true;
        imageId =   parseInt(imageId);
        deletedIds.push(imageId);
        $("#container-"+imageId).empty();
        console.log(deletedIds)
    })

});