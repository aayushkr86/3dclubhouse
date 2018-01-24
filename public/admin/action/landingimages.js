$('document').ready(function () {

    var isEdit  =   false;
    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var deletedIds  =   [],addedImages=[];
    var isNewImageSelected  =   false;
    var imageDeleted    =   false;


    var uploader    =   $("#landingImagesArray").uploadFile({
        url: '/admin/landingimgs/uploadlandingimg',
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

    $("#lndimgs-submit").click(function (e) {
        uploader.startUpload();
    });

    $("#view-all-lndimgs-list").click(function () {
       getAllImages();
    });
    function getAllImages() {
        $.ajax({
            url:"/admin/landingimgs/getlandingimages",
            type:'GET',
            success:function (data) {
                console.log("HomeImgs: ",data);
                showAllImages(data);
            }
        })
    }

    function showAllImages(images) {
        $("#lnd-imgs-list").empty();
        if(images != undefined){
            var form = '';
            for (var i=0;i<images.length;i++){
                form += '<li> <img style="border-radius: 0%;width: 100px;height: 100px;" src="'+images[i].landingimg_url+'" alt="User Image"> <div style="margin-top: 5px"> <button id="'+images[i].pk_landingimg_id+'" type="button" class="btn btn-danger btn-flat delete-lndimg"> <i class="fa fa-trash"></i> </button> </div></li>';
            }
            $("#lnd-imgs-list").append(form);
        }
    }

    $("body").on("click",".delete-lndimg",function () {
        var id = $(this).attr('id');
        var obj = {
            deleteIds:JSON.stringify([id])
        };
        $.ajax({
            url:"/admin/landingimgs/deletelandingimages",
            type:'POST',
            data:obj,
            success:function (data) {
                console.log("HomeImgs: ",data);
               getAllImages();
            }
        })
    })


});