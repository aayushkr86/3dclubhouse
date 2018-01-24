/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {

    var isNewImageSelected  =   false;
    var imageDeleted    =   false;
    var isEdit  =   false;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/admintutorialcategories?cat=") != -1){
        isEdit  =   $("#tutcategories-submit").attr("isEdit");
        var catImg  =   $("#tutcategories-submit").attr("tutorialCatImage");
        var level  =   $("#tutcategories-submit").attr("tutorialLevel");
        $("#tutorialLevel").val(level);
        oldImage    =   catImg;
        if(isEdit && catImg!= null && catImg != undefined
            && catImg.indexOf("3dclubhouse.s3.amazonaws.com") != -1
            && catImg.indexOf("category_default") == -1) {
            $("#tutcat-uploaded-img-container").show();
            $("#tutcat-uploaded-img").attr('src',catImg);
            $("#tutcategory-img-upload-container").hide();
        }
    }else {
        $("#tutcat-uploaded-img-container").hide();
        $("#tutcategory-img-upload-container").show();
    }

    getCategories();

    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var tutorialCatImage   =   "https://3dclubhouse.s3.amazonaws.com/categories/category_default.png";
    var oldImage    =   tutorialCatImage;
    $("#tutcategories-submit").click(function () {
        isEdit  =   $(this).attr("isEdit");
        //alert(isEdit)
        if(isEdit == true || isEdit == 'true'){
            if(isNewImageSelected){
                uploader.startUpload();
            }else {
                updateCategory();
            }
        }else {
            if(isNewImageSelected){
                uploader.startUpload();
            }else {
                addNewCategory();
            }
        }

    });


    function updateCategory() {
        var categoryName    =   $("#tutorialCategoryName").val();
        var categoryLevel   =   $("#tutorialLevel").val();


        var categoryObj     =   {
            tutorialCategoryName:categoryName,
            tutorialCatImage:tutorialCatImage,
            tutorialLevel:categoryLevel,
            isImageDeleted:imageDeleted,
            oldImage:oldImage
        };
        console.log(isNewImageSelected)
        console.log(tutorialCatImage)
        if(isNewImageSelected == true){
            categoryObj.tutorialCatImage   =   tutorialCatImage;
            categoryObj.isImageDeleted  =   false;
            categoryObj.isNewImage      =   true;
        }

        var catId   =   $("#tutcategories-submit").attr("tutorialCatId");
        categoryObj.pkTutorialCatId    =   catId;
        console.log(categoryObj)
        $.ajax({
            url: '/admin/tutorials/categories/updatecategory',
            type: 'POST',
            data: categoryObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully updated");

                        window.location.href    =   '/admin/admintutorialcategories';
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
    function addNewCategory() {
        var categoryName    =   $("#tutorialCategoryName").val();
        var categoryLevel   =   $("#tutorialLevel").val();


        var categoryObj     =   {
            tutorialCategoryName:categoryName,
            tutorialCatImage:tutorialCatImage,
            tutorialLevel:categoryLevel
        };
        $.ajax({
            url: '/admin/tutorials/categories/addcategory',
            type: 'POST',
            data: categoryObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully added");
                        $("#categoryName").val("");
                        $("#categoryDesc").val("");
                        $("#categoryUnique").val("");
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

    $("#view-all-categories-list").click(function (e) {
       getCategories();
    });


    function getCategories() {
        $.ajax({
            url:'/admin/tutorials/categories/getallcategories',
            type:'GET',
            success:function (categoryResult) {
                console.log("GetCats: ",categoryResult)
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildCategoriesList(categories);
                    buildCategoriesForAddProduct(categories)
                }
            }
        });
    }

    function  buildCategoriesForAddProduct(categories) {
        var optionForm  =   "";
        $("#selectTutCategory").empty();
        for(var i=0;i<categories.length;i++) {
            var currentCategory = categories[i];
            optionForm+="<option value='"+currentCategory.pkTutorialCatId+"'>"+currentCategory.tutorialCategoryName+"</option>"
        }
        $("#selectTutCategory").append(optionForm);

        isEdit  =   $("#productInsert").attr("isEdit");
        if(isEdit) {
            var fkCatId = $("#fkCategoryId").attr("categoryId");
            $("#selectTutCategory").val(fkCatId);
        }

    }
    function buildCategoriesList(categories) {
        var categoriesForm  =   "";
        $("#tutcategory-list-container").empty();
        for(var i=0;i<categories.length;i++){
            console.log(categories[i])
            var currentCategory =   categories[i];
            var categoryId  =   currentCategory.pkTutorialCatId;
            var categoryDesc    =   currentCategory.tutorialCategoryName;
            var categoryUnique  =   currentCategory.tutorialLevel;
            var tutorialCatImage   =   currentCategory.tutorialCatImage;

            if(currentCategory.tutorialCategoryName == "" || currentCategory.tutorialCategoryName == null){
                categoryDesc    =   "No Name found";
            }
            if(currentCategory.tutorialLevel == "" || currentCategory.tutorialLevel == null){
                categoryUnique    =   "No level name added";
            }
            if(currentCategory.tutorialCatImage == "" || currentCategory.tutorialCatImage == null){
                tutorialCatImage    =   "No image added";
            }

            categoriesForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+currentCategory.tutorialCategoryName+"</td>"+
                "<td>"+categoryUnique+"</td>"+
                "<td><a class='btn btn-default' href='/admin/admintutorialcategories?cat="+categoryId+"'><i class='fa fa-fw fa-edit'></i></a> <button class='deletetutcat btn btn-danger btn-small'data-tid=13046 id="+categoryId+"><i class='fa fa-fw fa-times'></i></button></td>";
        }
        $("#tutcategory-list-container").append(categoriesForm);
    }

    $('body').on('click','.deletetutcat',function () {
        var categoryId  =   $(this).attr("id");
        $.ajax({
            url:'/admin/tutorials/categories/deletecategory',
            type:'POST',
            data:{pkTutorialCatId:categoryId},
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

    var uploader    =   $("#tutcategory-image-upload").uploadFile({
        url: '/admin/tutorials/categories/uploadcategoryimage',
        allowedTypes: "jpg,png,gif,bmp,jpeg",
        fileName:"uploadfile",
        multiple: false,
        showCancel:true,
        showAbort:true,
        showDelete:true,
        showFileSize:true,
        autoSubmit:false,
        cancelStr:"Delete",
        serialize:true,
        showPreview:true,
        previewWidth:"50%",
        previewHeight:"50%",
        onLoad: function (obj) {
            console.log("Loaded: ",obj)
        },
        onSelect: function (files) {
            console.log("Select: ",files)
            isNewImageSelected  =   true;
            return true;
        },
        onSuccess: function (files, data, xhr)
        {
            $("#status").html("<font color='green'>Upload is successful</font>");
            //var str=document.getElementById("output").value;
            //document.getElementById("output").value=;
            console.log("UPLOAD DATA .. ")
            console.log(data)
            console.log(files)
            //productImagesArray.push(data[0]);
            tutorialCatImage   =   data;
            //
        },
        afterUploadAll: function ()
        {
            //alert("all images uploaded!!");
            console.log("trtrtrtrr")
            //addnewProduct();
            if(isEdit == true || isEdit == 'true'){
                updateCategory();
            }else{
                addNewCategory();
            }

        },
        onError: function (files, status, errMsg)
        {
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    });
//tutcategory-img-delete
    $('#tutcategory-img-delete').click(function() {
        $("#tutcat-uploaded-img-container").empty();
        imageDeleted    =   true;
        $("#tutcategory-img-upload-container").show();
    });
});