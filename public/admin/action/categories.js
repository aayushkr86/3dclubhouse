/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {

    var isNewImageSelected  =   false;
    var imageDeleted    =   false;
    var isEdit  =   false;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/admincategories?cat=") != -1){
        isEdit  =   $("#categories-submit").attr("isEdit");
        var catImg  =   $("#categories-submit").attr("categoryImage");
        oldImage    =   catImg;
        if(isEdit && catImg!= null && catImg != undefined
            && catImg.indexOf("3dclubhouse.s3.amazonaws.com") != -1
            && catImg.indexOf("category_default") == -1) {
            $("#cat-uploaded-img-container").show();
            $("#cat-uploaded-img").attr('src',catImg);
            $("#category-img-upload-container").hide();
        }
    }else {
        $("#cat-uploaded-img-container").hide();
        $("#category-img-upload-container").show();
    }

    getCategories();

    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var categoryImage   =   "https://3dclubhouse.s3.amazonaws.com/categories/category_default.png";
    var oldImage    =   categoryImage;
    $("#categories-submit").click(function () {
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
        var categoryName    =   $("#categoryName").val();
        var categoryDesc    =   $("#categoryDesc").val();
        var categoryUnique  =   $("#categoryUnique").val();

        var categoryObj     =   {
            categoryName:categoryName,
            categoryUnique:categoryUnique,
            categoryDesc:categoryDesc,
            isImageDeleted:imageDeleted,
            oldImage:oldImage
        };
        console.log(isNewImageSelected)
        console.log(categoryImage)
        if(isNewImageSelected == true){
            categoryObj.categoryImage   =   categoryImage;
            categoryObj.isImageDeleted  =   false;
            categoryObj.isNewImage      =   true;
        }

        var catId   =   $("#categories-submit").attr("categoryId");
        categoryObj.pkCategoryId    =   catId;
        $.ajax({
            url: '/admin/categories/updatecategory',
            type: 'POST',
            data: categoryObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully updated");

                        window.location.href    =   '/admin/admincategories';
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
        var categoryName    =   $("#categoryName").val();
        var categoryDesc    =   $("#categoryDesc").val();
        var categoryUnique  =   $("#categoryUnique").val();

        var categoryObj     =   {
            categoryName:categoryName,
            categoryUnique:categoryUnique,
            categoryImage:categoryImage,
            categoryDesc:categoryDesc
        };
        $.ajax({
            url: '/admin/categories/addcategory',
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

    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#cat-uploaded-img').attr('src', e.target.result);
                $("#cat-uploaded-img-container").show();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    // $("#categoryImageUpload").change(function (e) {
    //     readURL(this);
    //     //loadFile(e);
    //     imageUploadTapped   =   true;
    //     isImageUploaded =   false;
    //     categoryImage   =   "/admin/upload/default_category.png";
    //
    //     var extension = $(this).val().split('.').pop().toLowerCase();
    //     var ExtListToUpload = new Array('gif', 'jpeg', 'png', 'jpg');
    //     var isValidFileExt = $.inArray(extension, ExtListToUpload);
    //     if (isValidFileExt == -1) {
    //         alert("Please select a valid image type of gif/jpeg/png/jpg.");
    //     }else{
    //         var img = URL.createObjectURL(e.target.files[0]);
    //         ImageUpload("categoryImageUpload", function (err, data) {
    //
    //             if (!err) {
    //                     console.log(data);
    //                 //$('#cat-uploaded-img').attr('src', data);
    //                 categoryImage   =   data;
    //                 isImageUploaded =   true;
    //             }else{
    //                 console.log(err)
    //                 console.log(data)
    //                 categoryImage   =   "/admin/upload/default_category.png";
    //                 isImageUploaded =   false;
    //             }
    //         });
    //     }
    // });
    $("#view-all-categories-list").click(function (e) {
       getCategories();
    });


    function ImageUpload(imageId, callback) {
        if (imageUploadTapped == true) {
            ImageUploadData = new FormData();
            ImageUploadData.append('uploadfile', jQuery('#' + imageId)[0].files[0]);

            $.ajax({
                url: '/admin/categories/uploadcategoryimage',
                data: ImageUploadData,
                cache: false,
                processData: false,
                contentType: false,
                xhr: function () {
                    //upload Progress
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }

                        }, true);
                    }
                    return xhr;
                },
                type: 'POST',
                success: function (data, status, req) {
                    //$(".loading-bar-container").find(".progress-1").remove();
                    callback(false,data)

                },
                error: function (req, status, error) {
                    //$(".loading-bar-container").find(".progress-1").remove();
                    imageUploadTapped = false;
                    callback(true, error);
                }
            });
        } else {
            callback(true, false);
        }
    }
    function getCategories() {
        $.ajax({
            url:'/admin/categories/getallcategories',
            type:'GET',
            success:function (categoryResult) {
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
        $("#selectCategory").empty();
        for(var i=0;i<categories.length;i++) {
            var currentCategory = categories[i];
            optionForm+="<option value='"+currentCategory.pkCategoryId+"'>"+currentCategory.categoryName+"</option>"
        }
        $("#selectCategory").append(optionForm);

        isEdit  =   $("#productInsert").attr("isEdit");
        if(isEdit) {
            var fkCatId = $("#fkCategoryId").attr("categoryId");
            $("#selectCategory").val(fkCatId);
        }

    }
    function buildCategoriesList(categories) {
        var categoriesForm  =   "";
        $("#category-list-container").empty();
        for(var i=0;i<categories.length;i++){
            console.log(categories[i])
            var currentCategory =   categories[i];
            var categoryId  =   currentCategory.pkCategoryId;
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
                "<td>"+currentCategory.categoryName+"</td>"+
                "<td>"+categoryUnique+"</td>"+
                "<td>"+categoryDesc+"</td>"+
                "<td><a class='btn btn-default' href='/admin/admincategories?cat="+categoryId+"'><i class='fa fa-fw fa-edit'></i></a> <button class='deletecat btn btn-danger btn-small'data-tid=13046 id="+categoryId+"><i class='fa fa-fw fa-times'></i></button></td>";
        }
        $("#category-list-container").append(categoriesForm);
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

    var uploader    =   $("#category-image-upload").uploadFile({
        url: '/admin/categories/uploadcategoryimage',
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
            categoryImage   =   data;
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

    $('#category-img-delete').click(function() {
        $("#cat-uploaded-img-container").empty();
        imageDeleted    =   true;
        $("#category-img-upload-container").show();
    });
});