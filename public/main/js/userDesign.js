/**
 * Created by anooj on 28/06/17.
 */
$('document').ready(function () {
    var currentProductId;
    var productImages   =   [];
    var currentCartIds  =   [];
    var cartInfo        =   [];
    var defaultMaterial =   -1;
    var baseMaterialInfo    =   {};
    var l_ratio         =   0;
    var b_ratio         =   0;
    var h_ratio         =   0;
    var minLength         =   0;
    var minBreadth         =   0;
    var minHeight         =   0;
    var minProductPrice =   0;
    var price           =   0;
    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var productImagesArray=[];
    var productArray    =   [];
    var productIdsArray    =   [];
    var deletedIds  =   [],addedImages=[];
    var isNewImageSelected  =   false;
    var imageDeleted    =   false;
    var min_coeff   =   0;
    var max_coeff   =   0;
    let body            =   $("body");
    let productThumbs   =   $("#product-thumbnails");
    let imageThumb      =   ".prod-thumb";
    let zoomedImg       =   $("#img_zoom_prod");
    let addToCart       =   $("#add-to-cart");
    let productQuantity =   $("#product-quantity");
    let productMaterial =   $("#user-prod-detail-material-in");
    let productColor    =   $("#prod-detail-color");
    let productQuality  =   $("#prod-detail-quality");
    let productLength   =   $("#prod-detail-length");
    let productBreadth  =   $("#prod-detail-breadth");
    let productHeight   =   $("#prod-detail-height");
    let cartCountId     =   $(".cart-count");
    let cartPriceId     =   $("#cart-price");
    let productPrice    =   $("#product_price");
    let currentPath     =   window.location.pathname + window.location.search;
    let apiEndPoint     =   {
        addToCart:'/cart/addtocart',
        getCart:'/cart/getusercart'
    };
    var uploadedProductInfo =   {};

    var materialCost   =    {};

    loadMaterials();
    //getMaterialCost();
    getUserCart();
    var isDoodle    =   false;
    var imageUrl    =   "/admin/product/uploadtempuserproductimages";
    var formats       =   "stl";
    if(currentPath.indexOf("/designupload/doodle") != -1){
        isDoodle    =   true;
        formats =   "jpg,jpeg,png,bmp"
        getDoodlePrices();
        imageUrl    =   "/admin/product/uploadproductimages"
    }
    if(currentPath.indexOf("/product?id=") != -1){

        currentProductId    =   $("#add-to-cart").attr("pkProductId");
        productImages       =   JSON.parse($("#add-to-cart").attr("productImages"));
        baseMaterialInfo       =   JSON.parse($("#add-to-cart").attr("baseMaterial"));
        minProductPrice     =   parseFloat($("#add-to-cart").attr("minPrice")).toFixed(2);
        productPrice.text("Rs. "+minProductPrice);
        defaultMaterial =   $("#user-prod-detail-material-in").attr("def_material");
        minLength   =   productLength.val();
        minBreadth   =   productBreadth.val();
        minHeight   =   productHeight.val();
        min_coeff   =   $("#item-dimensions").attr("min_coefficient");
        max_coeff   =   $("#item-dimensions").attr("max_coefficient");

        if(min_coeff != null && min_coeff != undefined && min_coeff != ""){
            min_coeff   =   parseFloat(min_coeff);
        }
        if(max_coeff != null && max_coeff != undefined && max_coeff != ""){
            max_coeff   =   parseFloat(max_coeff)
        }

        console.log("base Mtar ",baseMaterialInfo)
        var isWished        =   $("#product-detail-wish").attr("isWished");
        if(isWished == true || isWished == 'true'){
            $("#product-detail-wish").removeClass("fa-heart-o");
            $("#product-detail-wish").addClass("fa-heart");

        }else{
            $("#product-detail-wish").addClass("fa-heart-o");
            $("#product-detail-wish").removeClass("fa-heart");
        }
        //calculatePrice(true);
        buildProductImageCarousel();
    }

    function calculatePrice(isFirst,coeff){
        price   =   parseFloat(parseFloat(minProductPrice)*parseFloat(coeff)).toFixed(2);
        productPrice.text("Rs. "+price);
    }
    function _calculatePrice(isFirst) {



        //Get Selected Material
        var materialId      =   productMaterial.val();

        //Get Selected Attributes
        var length          =   productLength.val();
        var breadth         =   productBreadth.val();
        var height          =   productHeight.val();

        //minLength   =   length;
        //minBreadth  =   breadth;
        //minHeight   =   height;

        //Get Selected Quality
        var quality         =   productQuality.val();

        //Get Base Material Config
        var baseMaterial    =   baseMaterialInfo.fkBaseMaterial;
        var baseMaterialId  =   baseMaterial.pkMaterialId;
        setRatio(minLength,minBreadth,minHeight)
        //l_ratio             =   baseMaterial.l_ratio;
        //b_ratio             =   baseMaterial.b_ratio;
        //h_ratio             =   baseMaterial.h_ratio;
        var qualityInfo     =   JSON.parse(baseMaterial.quality_percentage);
        var materialPrice   =   parseFloat(baseMaterial.materialCost);

        //Change Attributes
        if(isFirst) {
            length = parseFloat((length / l_ratio) * l_ratio).toFixed(2);
            breadth = parseFloat((length / l_ratio) * b_ratio).toFixed(2);
            height = parseFloat((length / l_ratio) * h_ratio).toFixed(2);
            //productLength.val(length);
            productBreadth.val(breadth);
            productHeight.val(height);
        }

        var priceFactor   =  minProductPrice/(minLength*minBreadth*minHeight);
        var volume        =  length*breadth*height;
        price         =  parseFloat(volume*priceFactor).toFixed(2);


        console.log("Material Comp: "+materialId+" : "+baseMaterialId);
        if(materialId == baseMaterialId){
            price   =   parseFloat(price+materialPrice).toFixed(2);
        }else{
            console.log("Before: ",price)
            console.log("percentage ",getOtherMaterialPercentage(materialId))
            var withPerc    =   parseFloat(materialPrice*(getOtherMaterialPercentage(materialId)/100)).toFixed(2);
            console.log("Adding: ",withPerc)
            price   =   parseFloat(parseFloat(price)+parseFloat(materialPrice)+parseFloat(withPerc)).toFixed(2);
            console.log("Final: ",price)
        }

        console.log(qualityInfo)
        var j=0
        for(j=0;j<qualityInfo.length;j++){
            var index   =   j+1;
         var qualityObj =   qualityInfo[j];
         console.log(qualityObj)
         if(qualityObj["quality_"+quality] != undefined){
             var qualityPerc    =   parseFloat(qualityObj["quality_"+quality]).toFixed(2);
             var perc_price     =   parseFloat(price)*parseFloat((qualityPerc/100));
             console.log("Qual: ",qualityPerc)
             console.log(perc_price)
             console.log("Finally adding")
             console.log(price)
             console.log(perc_price)
             price  =   parseFloat(parseFloat(price)+parseFloat(perc_price)).toFixed(2);
             break;
         }
        }

        productPrice.text("Rs. "+price);

    }

    function setRatio(l, b, h){
        var A = l;
        var B = b;
        var C = h;

        var X = B/A;
        var Y = C/A;
        var Q = "1 : "+X+" : "+Y;
        l_ratio =   1;
        b_ratio =   X;
        h_ratio =   Y
        //callback(1,X,Y);
    }

    function getOtherMaterialPercentage(materialId){
        var otherMatInfo    =   baseMaterialInfo.otherMaterials;


        for(var i=0;i<otherMatInfo.length;i++){
            var matId   =   otherMatInfo[i].pkMaterialId;
            if(materialId == matId){
                return parseFloat(otherMatInfo[i].percentage).toFixed(2);
            }
        }
        return 0;
    }



    function loadMaterials() {
        $.ajax({
            url:"/admin/materials/getallmaterials",
            type:'GET',
            success:function (materials) {
                if(materials.success != undefined && materials.success== true){

                    buildMaterialsUI(materials.data);
                }
            }
        });
    }
    function buildMaterialsUI(allMaterials) {
        productMaterial.empty();
        for(var i=0;i<allMaterials.length;i++){
            var selected    =   "";
            if(allMaterials[i].pkMaterialId == defaultMaterial){
                selected = "selected";
            }
            productMaterial.append("<option "+selected+" value='"+allMaterials[i].pkMaterialId+"' isBase='"+allMaterials[i].isBaseMaterial+"' cost='"+allMaterials[i].materialCost+"' >"+allMaterials[i].materialName+"</option>")
        }
        //calculatePrice(true);
        var matId = $("#user-prod-detail-material-in option:selected").val();
        getColorOfMaterial(matId);
    }

    body.on('click',imageThumb,function () {
        var img =   ($(this).attr('data-image'));
        zoomedImg.attr('src',img)
        zoomedImg.attr('data-zoom-image',img)
    });



    function getUserCart() {
        $.ajax({
            url:apiEndPoint.getCart,
            type:'POST',
            data:{},
            success:function (cart) {
                console.log("CART: ",cart)
                if(cart.success == true && cart.data != undefined) {
                    buildCartUI(cart.data);
                }
            }
        })
    }

    function buildCartUI(cartInfo) {
        cartCountId.text(cartInfo.length);
        var totalPrice  =   0;
        for(var i=0;i<cartInfo.length;i++){
            totalPrice+=(parseFloat(cartInfo[i].quantity)*parseInt(cartInfo[i].calculatedPrice));
        }
        $("#grant-total").text("Rs."+totalPrice)
        cartPriceId.text("Rs."+totalPrice);
        $("#grant-total").attr('grand',totalPrice);
    }


    var pr_data =   {};

    function uploadDoodlewithData() {
        pr_data =   {
            price: parseFloat($("#user-prod-prices option:selected").attr("price")),
            productName:$("#productName").val(),
            productDesc: $("#productDesc").val(),
            quantity : productQuantity.val()
        };
        if(pr_data.productName != "") {
            uploader.startUpload();
        }
    }

    function uploadSTLwithData() {
        pr_data =   {
            productName:$("#user_productName").val(),
            productDesc: $("#user_productDesc").val(),
            productMinLength: $("#user_prod-detail-length").val(),
            productMinHeight: $("#user_prod-detail-height").val(),
            productMinBreadth: $("#user_prod-detail-breadth").val(),
            files: JSON.stringify(productImagesArray),
            productMaterialId:$("#user-prod-detail-material-in option:selected").val(),
            productColor:$("#user-prod-detail-color-mat option:selected").val(),
            productQuality:$("#user_prod-detail-quality").val(),
            productStrength:$("#user_prod-detail-strength").val()
        };
        if(pr_data.productName != "") {
            uploader.startUpload()
        }
    }


    var uploader    =   $("#user_productImagesArray").uploadFile({
        url: imageUrl,
        allowedTypes: formats,
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
        dynamicFormData: function()
        {

            return pr_data;
        },
        onSuccess: function (files, data, xhr)
        {
            $("#status").html("<font color='green'>Upload is successful</font>");
            //var str=document.getElementById("output").value;
            //document.getElementById("output").value=;
            console.log("UPLOAD DATA .. ")
            console.log(data)
            console.log(files)
            productImagesArray.push(data[0]);

            //
        },
        onSelect: function (files) {
            console.log("OnSelect: ",files)
            console.log($(".ajax-file-upload").children().children());
            console.log(new Date().getTime())
            isNewImageSelected  =   true;

            var inputs, index;

            inputs = document.getElementsByTagName('input');



            return true;
        },
        afterUploadAll: function (data)
        {
            //alert("all images uploaded!!");
            //$("div#divLoading").removeClass('show');
            console.log("trtrtrtrr");
            console.log(data);
            // if(isEdit == true || isEdit == 'true'){
            //     //updateProduct();
            // }else{
            if(!isDoodle) {
                addnewProduct();
            }else{
                addnewDoodleProduct();
            }
            //}

        },
        onError: function (files, status, errMsg)
        {
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    });

    function addnewProduct() {
        pr_data.files   =   JSON.stringify(productImagesArray),
        console.log(pr_data);

        $.ajax({
            url: '/admin/product/uploadtempuserproduct',
            type: 'POST',
            dataType: 'json',
            data: pr_data,
            success: function (data) {
                console.log(data);
                $("div#divLoading").removeClass('show');
                updatePriceAndValues(data);
            }
        });
    }

    function addnewDoodleProduct() {
        pr_data.files   =   JSON.stringify(productImagesArray),
            console.log(pr_data);

        $.ajax({
            url: '/admin/product/adddoodleproduct',
            type: 'POST',
            dataType: 'json',
            data: pr_data,
            success: function (data) {
                console.log(data);
                $("div#divLoading").removeClass('show');
                window.location.href = "/myaccount-orders"
                //updatePriceAndValues(data);
            }
        });
    }

    function updatePriceAndValues(priceInfo) {
        $("#product_price").text("Rs."+priceInfo.price);
        $("#design-to-cart").text("Confirm Order");
        $("#price-help").hide();//style("display","none")

        uploadedProductInfo =   priceInfo;
        $("#design-to-cart").attr("isorder",1);
    }


    function confirmDesignUpload() {
        $.ajax({
            url:'/admin/product/confirmdesignorder',
            type:'POST',
            data:uploadedProductInfo,
            success:function (status) {
                if(status == true){
                    window.location.href = 'http://34.202.5.62/myaccount-orders';
                }
            }
        });
    }

    function getDoodlePrices() {
        $.ajax({
            url:'/admin/doodle/getalldoodleprices',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    }
    function buildPostProListUI(postPros) {
        console.log(postPros)
        var form    =   "";
        $("#user-prod-prices").empty();
        for(var i=0;i<postPros.length;i++){
            var ppId   =   postPros[i].pk_doodle_price_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<option id='"+ppId+"' value='"+ppId+"' price='"+postPros[i].price+"'>"+postPros[i].price+"</option>";
        }
        $("#user-prod-prices").append(form);

    }

    $("#doodle-design-to-cart").click(function (e) {
        $("#design-to-cart").text("Please Wait");
        $("div#divLoading").addClass('show');
        uploadDoodlewithData();
    })
    $("#design-to-cart").click(function (e) {
        //TODO: Validation
        //alert("jj")
        var isOrder =   $("#design-to-cart").attr("isorder");
        if(isOrder != null && isOrder != undefined && (isOrder == 1 || isOrder == "1")){
            var q   =   parseFloat(productQuantity.val());
            var p   =   parseFloat(uploadedProductInfo.price);
            p       =   q*p;
            uploadedProductInfo.quantity  =   q;
            uploadedProductInfo.calculatedPrice = p;
            console.log("CONF: ",uploadedProductInfo);
            confirmDesignUpload();
        }else {
            if ($("#productName").val() != "") {
                //addnewProduct();
                if (isNewImageSelected) {
                    $("#design-to-cart").text("Please Wait");
                    $("div#divLoading").addClass('show');
                    uploadSTLwithData();
                }
            }
        }
    });

    $('#user-prod-detail-material-in').on('change', function() {
        var materialId = $(this).val();
        getColorOfMaterial(materialId);
    });

    function getColorOfMaterial(materialId) {
        $.ajax({
            url:'/admin/colors/getcolorsofmaterial',
            type:'POST',
            data:{materialId:materialId},
            success:function (colorStatus) {
                console.log("COLOR_S: ",colorStatus);
                loadColorsofMaterial(colorStatus.data);
            }
        })
    }

    function loadColorsofMaterial(colors) {
        $("#user-prod-detail-color-mat").empty();
        var form = '';
        for(var i=0;i<colors.length;i++){
            var id = colors[i].fk_color_id;
            var data = colors[i].colorName;
            form += '<option value="'+id+'">'+data+'</option>';
        }
        $("#user-prod-detail-color-mat").append(form);
    }
});