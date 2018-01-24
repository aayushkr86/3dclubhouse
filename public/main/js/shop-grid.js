/**
 * Created by anoojmon on 26/06/17.
 */
jQuery('document').ready(function () {
    let $               =   jQuery;
    let shopGrid        =   $("#shop-grid");
    let pageLimit        =   $("#page-limit");
    let apiEndPoints=   {
        getAllCategories:'/user/categories/getallcategories',
        getRecentProductsOfCat:'/user/categories/getrecentproductsoncat'
    };
    let currentPath     =   window.location.pathname + window.location.search;
    var isShopPage      =   false;
    var categoryIdFromSearch    =   0;
    if(currentPath.indexOf("shop?category=") != -1){
        isShopPage  =   true;
    }
    var categories  =   [],recentProducts=[];
    init();


    function init(){
        if(isShopPage) {
            $("div#divLoading").addClass('show');
            loadProducts();
        }
    };

    function loadProducts(){
        shopGrid.empty();
        var products    =   shopGrid.attr("products");
        var categoryObj    =   shopGrid.attr("categoryname");
        products        =   JSON.parse(products);
        categoryObj     =   JSON.parse(categoryObj);
        var catName =   "";
        var form="";
        if(products.length > 0){
            for(var i=0;i<products.length;i++){
                if(products[i].pkProductId != null && products[i].pkProductId != undefined && products[i].pkProductId != "") {
                    var isWished = false;
                    var wishForm = '<i id="wisher_' + products[i].pkProductId + '" aria-hidden=true class="fa fa-heart-o">';
                    if (products[i].isWished > 0) {
                        isWished = true;
                        wishForm = '<i id="wisher_' + products[i].pkProductId + '" aria-hidden=true class="fa fa-heart">';
                    }
                    wishForm="";
                    /*
                    '<a isWished=' + isWished + ' wishedProduct=' + products[i].pkProductId + ' style="cursor: pointer" class=wishlist_products>' +
                        wishForm +
                        '</i>Add to Wishlist</a>
                     */
                    catName = products[i].categoryName;
                    form += '<div class="col-md-3 col-sm-6 col-xs-6 equal-elem padding-0 product-item style1 width-33">' +
                        '<div class=product-inner><div class=product-thumb><div class=thumb-inner>' +
                        '<a href="/product?id=' + products[i].pkProductId + '"><img alt=p8 src=' + products[i].defaultImage + '></a></div></div>' +
                        '<div class=product-innfo><div class=product-name>' +
                        '<center><span style="font-weight: bold;"><a href="/product?id=' + products[i].pkProductId + '">' + (products[i].productName).toUpperCase() + '</a></span></center></div>' +
                        //'<span class=price><ins>Rs.' + products[i].minPrice + '</ins></span>' +
                        '<div class=single-add-to-cart>' +
                        '</div></div></div></div>';
                }
            }

            $(".category-tit").text(categoryObj.categoryName)
            //$("#category-titl").text(catName)
        }else{
            shopGrid.append('<div><h3><i>No products available for this category at this moment</i></h3></div>');
        }
        $(".category-tit").text(categoryObj.categoryName)

        // var pageLi=document.getElementById("page-limit").value;
        // for(var i=0;i< pageLi ;i++){
        //     //alert(i)
        //     console.log("asdasd");
        //     form+='<div class="product-item style1 width-33 padding-0 col-md-3 col-sm-6 col-xs-6 equal-elem"> <div class="product-inner"> <div class="product-thumb"> <div class="thumb-inner"> <a href="#"><img src="/main/images/product/p8.jpg" alt="p8"></a> </div></div><div class="product-innfo"> <div class="product-name"><a href="/product">Acers Aspire S7 is a thin and portable laptop</a></div><span class="price"> <ins>Rs.229.00</ins></span> <div class="single-add-to-cart"> <a href="#" class="btn-add-to-cart">Add to cart</a> <a href="#" class="wishlist"><i class="fa fa-heart-o" aria-hidden="true"></i>Add to Wishlist</a> </div></div></div></div>';
        // }
         shopGrid.append(form);
         $("div#divLoading").removeClass('show');
    };
    $('#page-limit').on('change', function() {
        loadProducts();
    })

    $("body").on('click','.wishlist_products',function (e) {
        var _this   =   $(this);
        var id  =   $(this).attr('wishedProduct');
        var isWished    =   $(this).attr("isWished");
        var isFromWishListPage  =   $(this).attr("isFromWishListPage");
        console.log(isWished)
        var url =   "/cart/addtowishlist";
        if(isWished == "true" || isWished == true){
            url =   "/cart/removefromwishlist"
        }
        $.ajax({
            url:url,
            type:'POST',
            data:{productId:id},
            success:function (data) {
                console.log(data);
                if(data.success == true) {
                    if (isWished == "false" || isWished == false) {
                        $("#wisher_" + id).removeClass("fa-heart-o");
                        $("#wisher_" + id).addClass("fa-heart");
                        $("#product-detail-wish").removeClass("fa-heart-o");
                        $("#product-detail-wish").addClass("fa-heart");

                        _this.attr("isWished",true);
                    } else {
                        $("#wisher_" + id).removeClass("fa-heart");
                        $("#wisher_" + id).addClass("fa-heart-o");
                        $("#product-detail-wish").addClass("fa-heart-o");
                        $("#product-detail-wish").removeClass("fa-heart");

                        _this.attr("isWished",false);
                    }
                    if(isFromWishListPage != undefined && isFromWishListPage != 'false'){
                        $("#wishlist_"+id).empty();
                        getWishList();
                    }
                }
            }
        })
    })

    function getWishList() {
        $.ajax({
            url:'/cart/getmywishlist',
            type:'GET',
            success:function (wish) {
                console.log("CART: ",wish)
                if(wish.success == true && wish.data != undefined) {
                    var wishInfo    =   wish.data;
                    if(wishInfo.length > 0) {
                        buildWishListUI(wishInfo);
                    }else{
                        window.location.reload();
                    }
                }
            }
        })
    }

    function buildWishListUI(wishInfo) {
        var form    =   '';
        $("#wishlist-container").empty();
        var totalPrice  =   0;
        for(var i=0;i<wishInfo.length;i++){
            totalPrice+=parseInt(wishInfo[i].minPrice)
            form+="<tr id='wishlist_"+wishInfo[i].pkProductId+"'><td class=tb-price><span class=price>"+(i+1)+"</span>" +
                "<td class=tb-image><a href=# class=item-photo><" +
                "img alt=cart src="+wishInfo[i].defaultImage+"></a><td class=tb-product>" +
                "<div class=product-name><a href=/product?id="+wishInfo[i].pkProductId+">"+wishInfo[i].productName+"</a></div>" +
                "<td class=tb-price><span class=price>Rs."+wishInfo[i].minPrice+"</span>" +
                "<td class=tb-remove><a wishedProduct="+wishInfo[i].pkProductId+" isWished='true' isFromWishListPage='true' id='wish-remove' style='cursor:pointer' class='action-remove wishlist_products'><span>" +
                "<i aria-hidden=true class='fa fa-times'></i></span></a></td></tr>"
        }
        $("#wishlist-container").append(form);
        $("#wish-subtotal").text("Rs."+totalPrice);
        $("#wish-total").text("Rs."+totalPrice);
    }
});