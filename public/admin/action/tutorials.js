/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isEdit  =   false;
    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var resourcesArray=[];
    var resArray    =   [];
    var productIdsArray    =   [];
    var deletedIds  =   [],addedImages=[];
    var isNewImageSelected  =   false;
    var imageDeleted    =   false;

    var host    =   window.location.protocol+"//"+window.location.host;

    //console.log("Current Product Image ",);

    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/admintutorials?id=") != -1){
        //setTimeout(function () {
        extLinkCounter  =   0;
            var isEdit  =   $("#tutorialInsert").attr("isEdit");
            console.log("Found product info", host)
            console.log($("#tut-productimg-loaded").attr("tutorialResources"));
            resArray = $("#tut-productimg-loaded").attr("tutorialResources");
            if (resArray != undefined && resArray.length > 0) {
                $("#tuto-existingImages-container").show();
                resArray = JSON.parse(resArray);
                console.log(resArray)

                $("#tuto-existingImages").empty();
                var imageForm = "";
                for (var i = 0; i < resArray.length; i++) {
                    var imageName = resArray[i].resourceLink;
                    var imgForm=getResourceType(imageName,resArray);
                    //var imgForm="";
                    // if(type == 0)
                    //     imgForm =
                    // else if(type == 1)
                    //     imgForm =   "<img class='img-wrap_responsive' src='" + imageName + "' data-id='" + resArray[i].pkTutorialResId + "'> " +

                    productIdsArray.push(resArray[i].pkTutorialResId);
                    imageForm += "<div id='container-"+resArray[i].pkTutorialResId+"' class='col-sm-2 img-col'> <div class='img-wrap'> " +
                        "<span id='"+resArray[i].pkTutorialResId +"' class='close productimage-close'>×</span> " +
                        imgForm+
                        "</div></div>";
                }
                $("#tuto-existingImages").append(imageForm);
            }else{
                $("#tuto-existingImages-container").hide();
            }
        //},2000);
    }else{
        $("#tuto-existingImages-container").hide();
    }
    var uploader    =   $("#tutorialsImagesArray").uploadFile({
        url: '/admin/tutorials/uploadtutorials',
        allowedTypes: "*",
        fileName:"uploadfile",
        multiple: true,
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
        onSuccess: function (files, data, xhr)
        {
            $("#status").html("<font color='green'>Upload is successful</font>");
            //var str=document.getElementById("output").value;
            //document.getElementById("output").value=;
            console.log("UPLOAD DATA .. ")
            console.log(data)
            console.log(files)
            resourcesArray.push(data[0]);
            if(isEdit == true || isEdit == 'true'){
                addedImages.push(data[0]);
            }
            //
        },
        onSelect: function (files) {
            console.log("Select: ",files)
            isNewImageSelected  =   true;
            return true;
        },
        afterUploadAll: function ()
        {
            //alert("all images uploaded!!");
            console.log("trtrtrtrr");
            if(isEdit == true || isEdit == 'true'){
                updateTutorial();
            }else{
                addNewTutorial();
            }

        },
        onError: function (files, status, errMsg)
        {
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    });
    
    $("#tutorialInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
            if(isNewImageSelected){
                uploader.startUpload();
            }else {
                updateTutorial();
            }
        }else {
            if(isNewImageSelected) {
                uploader.startUpload();
            }else{
                addNewTutorial();
            }

        }


    });

    function getResourceType(filename) {
        if(checkIsImage(filename) == 1){
            return "<img class='img-wrap_responsive' src='" + filename + "' data-id='" + resArray.pkTutorialResId + "'> ";
        }
        if(checkYoutube(filename) != 0){
            var yForm='<iframe id="videoObject" type="text/html" width="98" height="98" frameborder="0" allowfullscreen src="'+checkYoutube(filename)+'"></iframe>'
            return yForm;
        }
        return "<a target='_blank' href='"+filename+"'><img class='img-wrap_responsive' src='https://3dclubhouse.s3.amazonaws.com/categories/category_default.png' data-id='" + resArray.pkTutorialResId + "'></a> ";


    }
    function checkIsImage(filename) {
        let ext =   (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
        if(ext.length >0) {
            ext = ext[0];
            console.log("Extension: ", ext);
            var availableImgExt = ['jpg', 'png', 'gif', 'bmp', 'jpeg'];
            if (availableImgExt.indexOf(ext) != -1) {
                return 1;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }
    function checkIsDocument(filename) {
        let ext =   (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
        if(ext.length >0) {
            ext = ext[0];
            console.log("Extension: ", ext);
            var availableImgExt = ['pdf', 'doc', 'gif', 'bmp', 'jpeg'];
            if (availableImgExt.indexOf(ext) != -1) {
                return 1;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }
    function checkYoutube(url) {
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                //$('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');
                return 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1';
            } else {
                return 0;
            }
        }else{
            return 0;
        }
    }

    function updateTutorial() {
        var tutorialTitle =   $("#tutorialTitle").val();
        var tutorialDesc =   $("#tutorialDesc").val();
        for(var i=0;i<extLinkCounter;i++){
            var ext_link    =   $("#tutorialLink_"+i).val();
            if(ext_link != null && ext_link != undefined && ext_link != ""){
                addedImages.push(ext_link);
            }
        }
        var catId              =   $("#selectTutCategory option:selected").val();
        var productObj  =   {
            tutorialTitle: tutorialTitle,
            tutorialDesc: tutorialDesc,
            deletedImages:JSON.stringify(deletedIds),
            addedImages:JSON.stringify(addedImages),
            fkTutorialCatId:catId
        };
        var productId   =   $("#tutorialInsert").attr("productId");
        productObj.pkProductId  =   productId;
        console.log(productObj);
        $.ajax({
            url: '/admin/tutorials/updatetutorial',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/admintutorials';
                }
            }
        });
    }
    function addNewTutorial() {
        var isEdit  =   $("#productInsert").attr("isEdit");
        var tutorialTitle =   $("#tutorialTitle").val();
        var tutorialDesc =   $("#tutorialDesc").val();
        var catId              =   $("#selectTutCategory option:selected").val();

        for(var i=0;i<extLinkCounter;i++){
            var ext_link    =   $("#tutorialLink_"+i).val();
            if(ext_link != null && ext_link != undefined && ext_link != ""){
                resourcesArray.push(ext_link);
            }
        }
        var productObj  =   {
            //productInfo: {
            tutorialTitle: tutorialTitle,
            tutorialDesc: tutorialDesc,
            tutorialResources: resourcesArray,
            fkTutorialCatId:catId
            //}
        };
        console.log(productObj)
        $.ajax({
            url: '/admin/tutorials/addtutorial',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    window.location.reload();
                }
            }
        });
    }


    $("#view-products").click(function (e) {
        $.ajax({
            url:'/admin/tutorials/getalltutorials',
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
    function buildProductListUI(tutorials) {
        console.log(tutorials)
        var form    =   "";
        $("#tuto-product-list-container").empty();
        for(var i=0;i<tutorials.length;i++){
            var productId   =   tutorials[i].pkTutorialId;
            console.log(JSON.stringify(tutorials[i]))
            form+="<tr><td>"+(i+1)+"<td>"+tutorials[i].tutorialTitle+
                "<td>"+tutorials[i].tutorialCategoryName+"<td>"+tutorials[i].tutorialDesc+
                    "<td><a href='/admin/admintutorials?id="+tutorials[i].pkTutorialId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  <button class='deleteprod btn btn-danger btn-small' id="+productId+" data-tid='13046'><i class='fa fa-fw fa-times'></i></button></td>"+
                "</tr>";
        }
        $("#tuto-product-list-container").append(form);

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


    $(".productimage-close").click(function (e) {
        var imageId =   ($(this).attr('id'));
        imageDeleted    =   true;
        imageId =   parseInt(imageId);
        deletedIds.push(imageId);
        $("#container-"+imageId).empty();
        console.log(deletedIds)
    })

    var extLinkCounter =   0;
    $("#tuto-addNewLink").click(function () {
        if(extLinkCounter == 0){
            addExtLink();
        }else{
            var prevLink    =   extLinkCounter-1;
            var ext_link    =   $("#tutorialLink_"+prevLink).val();
            if(ext_link != null && ext_link != undefined && ext_link != ""){
                addExtLink();
            }
        }
        console.log()
    })
    function addExtLink() {
        console.log(extLinkCounter)
        $("#tuto-ext-link").append('<input type="text" class="form-control" id="tutorialLink_'+extLinkCounter+'" placeholder="Paste Link Here">')
        extLinkCounter++;
    }
});