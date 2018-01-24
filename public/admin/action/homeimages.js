$('document').ready(function () {

    var isEdit  =   false;
    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var deletedIds  =   [],addedImages=[];
    var isNewImageSelected  =   false;
    var imageDeleted    =   false;


    var uploader    =   $("#homeImagesArray").uploadFile({
        url: '/admin/homeimgs/uploadhomeimg',
        allowedTypes: "jpg,png,gif,bmp,jpeg",
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
            productImagesArray.push(data[0]);
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
            console.log("trtrtrtrr");
            window.location.reload();
        },
        onError: function (files, status, errMsg)
        {
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    });

    $("#hmimgs-submit").click(function (e) {
        uploader.startUpload();
    });

    $("#view-all-hmimgs-list").click(function () {
       getAllImages();
    });
    function getAllImages() {
        $.ajax({
            url:"/admin/homeimgs/gethomeimages",
            type:'GET',
            success:function (data) {
                console.log("HomeImgs: ",data);
                showAllImages(data);
            }
        })
    }

    function showAllImages(images) {
        $("#home-imgs-list").empty();
        if(images != undefined){
            var form = '';
            for (var i=0;i<images.length;i++){
                form += '<li> <img style="border-radius: 0%;width: 100px;height: 100px;" src="'+images[i].homeimageurl+'" alt="User Image"> <div style="margin-top: 5px"> <button id="'+images[i].pkhomeimgid+'" type="button" class="btn btn-danger btn-flat delete-hmimg"> <i class="fa fa-trash"></i> </button> </div></li>';
            }
            $("#home-imgs-list").append(form);
        }
    }

    $("body").on("click",".delete-hmimg",function () {
        var id = $(this).attr('id');
        var obj = {
            deleteIds:JSON.stringify([id])
        };
        $.ajax({
            url:"/admin/homeimgs/deletehomeimages",
            type:'POST',
            data:obj,
            success:function (data) {
                console.log("HomeImgs: ",data);
               getAllImages();
            }
        })
    })


});