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
    let productMaterial =   $("#prod-detail-material-in");
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

    var materialCost   =    {};

    loadMaterials();
    getMaterialCost();
    getUserCart();

    if(currentPath.indexOf("/product?id=") != -1){

        currentProductId    =   $("#add-to-cart").attr("pkProductId");
        productImages       =   JSON.parse($("#add-to-cart").attr("productImages"));
        baseMaterialInfo       =   JSON.parse($("#add-to-cart").attr("baseMaterial"));
        minProductPrice     =   parseFloat($("#add-to-cart").attr("minPrice")).toFixed(2);
        productPrice.text("Rs. "+minProductPrice);
        defaultMaterial =   $("#prod-detail-material-in").attr("def_material");
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

    productMaterial.on('change', function() {
        //calculatePrice(false,current_coeff);
    });

    productQuality.on("input change", function() {
        //calculatePrice(false,current_coeff);
    })


    productLength.on("keyup mouseup",function () {

        if(event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 8 && event.keyCode != 46) {
            var length = productLength.val();
            var breadth = productBreadth.val();
            var height = productHeight.val();
            //length = parseFloat((length / l_ratio) * l_ratio).toFixed(2);
            var current_coeff   =   parseFloat(parseFloat(length)/parseFloat(minLength));
            if(current_coeff <= parseFloat(max_coeff) && current_coeff >= parseFloat(min_coeff)){
                breadth =   parseFloat(parseFloat(minBreadth)*current_coeff).toFixed(2);
                height = parseFloat(parseFloat(minHeight)*current_coeff).toFixed(2);
            }

            // //productLength.val(length);
            // if(breadth <= 50) {
                productBreadth.val(breadth);
            // }
            // if(height <= 50) {
                productHeight.val(height);
            // }
            calculatePrice(false,current_coeff);
        }
    });

    productBreadth.on("keyup mouseup",function () {

        if(event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 8 && event.keyCode != 46) {
            var length = productLength.val();
            var breadth = productBreadth.val();
            var height = productHeight.val();
            var current_coeff   =   parseFloat(parseFloat(breadth)/parseFloat(minBreadth));
            if(current_coeff <= parseFloat(max_coeff) && current_coeff >= parseFloat(min_coeff)){
                length =   parseFloat(parseFloat(minLength)*current_coeff).toFixed(2);
                height = parseFloat(parseFloat(minHeight)*current_coeff).toFixed(2);
            }
            //if(length <= 50) {
                productLength.val(length);
            //}
            //productBreadth.val(breadth);
            //if(height <= 50) {
                productHeight.val(height);
            //}
            calculatePrice(false,current_coeff);
        }
    });

    productHeight.on("keyup mouseup",function (event) {
        if(event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 8 && event.keyCode != 46) {
            var length = productLength.val();
            var breadth = productBreadth.val();
            var height = productHeight.val();
            var current_coeff   =   parseFloat(parseFloat(height)/parseFloat(minHeight));
            if(current_coeff <= parseFloat(max_coeff) && current_coeff >= parseFloat(min_coeff)){
                length =   parseFloat(parseFloat(minLength)*current_coeff).toFixed(2);
                breadth = parseFloat(parseFloat(minBreadth)*current_coeff).toFixed(2);
            }
            //if(length <= 50) {
                productLength.val(length);
            //}
            //if(breadth <= 50) {
                productBreadth.val(breadth);
            //}
            //productHeight.val(height);
            calculatePrice(false,current_coeff);
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
                    if(currentPath.indexOf("/designupload") != -1) {

                        baseMaterialInfo = matData;
                        console.log("DESIGNUPLOAD: ",baseMaterialInfo)
                        var _basePrice  =   materialCost.materialCost;
                        var length          =   parseFloat(productLength.val());
                        var breadth         =   parseFloat(productBreadth.val());
                        var height          =   parseFloat(productHeight.val());
                        minLength = length;
                        minBreadth  =   breadth;
                        minHeight   =   height;
                        var _volume        =  length*breadth*height;
                        _basePrice          =   _basePrice*_volume;
                        minProductPrice = _basePrice;
                        console.log("DESIGNUPLOAD_COST: ",length)
                        //calculatePrice(true);
                    }
                }
            }
        })
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
        var matId = $("#prod-detail-material-in option:selected").val();
        getColorOfMaterial(matId);
    }

    body.on('click',imageThumb,function () {
        var img =   ($(this).attr('data-image'));
        zoomedImg.attr('src',img)
        zoomedImg.attr('data-zoom-image',img)
    });

    addToCart.click(function () {
        var cartProductId   =   addToCart.attr('pkProductId');
        var quantity        =   productQuantity.val();
        var materialId      =   productMaterial.val();
        var colorId         =   productColor.val();
        var quality         =   productQuality.val();
        var length          =   productLength.val();
        var breadth         =   productBreadth.val();
        var height          =   productHeight.val();

        var cartObj         =   {
            fkProductId:cartProductId,
            fkMaterialId:materialId,
            fkColorId:colorId,
            height:height,
            length:length,
            breadth:breadth,
            quality:quality,
            quantity:quantity,
            price:price
        };
        
        //cartInfo.push(cartObj);
        addCart(cartObj);
    });

    function addCart(cartObj) {
        $("div#divLoading").addClass('show');
        $.ajax({
           url:apiEndPoint.addToCart,
           type:'POST',
           data:cartObj,
           success:function (cart) {
               console.log("After add: ",cart);
               $("div#divLoading").removeClass('show');
               if(cart.success == true && cart.data != undefined) {
                   buildCartUI(cart.data);
               }
           }
        });
    }
    function buildProductImageCarousel() {
        productThumbs.empty();
        for(var i=0;i<productImages.length;i++){
            var thumb   =   '<a class="prod-thumb" data-image='+productImages[i].productImage+' data-zoom-image=/'+productImages[i].productImage+' href="#">' +
                '<img alt=i1 data-large-image='+productImages[i].productImage+' src='+productImages[i].productImage+'></a>';
            productThumbs.append(thumb);
        }
    }
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




    var uploader    =   $("#productImagesArray").uploadFile({
        url: '/admin/product/uploaduserproductimages',
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
            // if(isEdit == true || isEdit == 'true'){
            //     //updateProduct();
            // }else{
            addnewProduct();
            //}

        },
        onError: function (files, status, errMsg)
        {
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    });

    function addnewProduct() {

        var productName =   $("#productName").val();
        var productDesc =   $("#productDesc").val();
        var productMinLength    =   productLength.val();
        var productMinHeight    =   productHeight.val();
        var productMinBreadth   =   productBreadth.val();



        var productObj  =   {
            //productInfo: {
            productName: productName,
            productDesc: productDesc,
            productMinLength: productMinLength,
            productMinHeight: productMinHeight,
            productMinBreadth: productMinBreadth,
            productImages: JSON.stringify(productImagesArray),
            fkMaterialId:productMaterial.val(),
            fkColorId:productColor.val(),
            quality:productQuality.val(),
            quantity:productQuantity.val(),
            infill:$("#productInfill").val(),
            layerHeight:$("#productLayerHeight").val(),
            shellThickness:$("#productShellThickness").val(),
            topThickness:$("#productTopThickness").val(),
            bottomThickness:$("#productBottomThickness").val(),
            topbottomThickness:$("#productTopBottomThickness").val(),
            price:price
            //}
        };
        console.log(productObj);
        
        $.ajax({
            url: '/admin/product/adduserproduct',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                $("div#divLoading").removeClass('show');
                if (data.success == true) {
                    window.location.href = 'http://34.202.5.62/cart';
                }
            }
        });
    }

    $("#design-to-cart").click(function (e) {
        //TODO: Validation
        //alert("jj")
        if($("#productName").val() != "") {
            //addnewProduct();
            if (isNewImageSelected) {
                $("#design-to-cart").text("Please Wait")
                $("div#divLoading").addClass('show');
                uploader.startUpload();
            }
        }
    });

    $('#prod-detail-material-in').on('change', function() {
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
        $("#prod-detail-color-mat").empty();
        var form = '';
        for(var i=0;i<colors.length;i++){
            var id = colors[i].fk_color_id;
            var data = colors[i].colorName;
            form += '<option value="'+id+'">'+data+'</option>';
        }
        $("#prod-detail-color-mat").append(form);
    }
});