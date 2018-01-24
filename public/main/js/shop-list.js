/**
 * Created by anoojmon on 26/06/17.
 */
jQuery('document').ready(function () {
    let $               =   jQuery;
    let shopList        =   $("#shop-list");
    let pageLimit        =   $("#page-limit");
    let apiEndPoints=   {
        getAllCategories:'/user/categories/getallcategories',
        getRecentProductsOfCat:'/user/categories/getrecentproductsoncat'
    };
    var categories  =   [],recentProducts=[];
    init();


    function init(){
        //loadProducts();
    };

    function loadProducts(){
        shopList.empty();
        var form="";
        var pageLi=document.getElementById("page-limit").value;
        for(var i=0;i< pageLi ;i++){
            form+='<div class="product-items"> <div class="product-image"> <a href="#"><img src="/main/images/product/p1.jpg" alt="p1"></a> </div><div class="product-info"> <div class="product-name"><a href="/product">Acers Aspire S7 is a thin and portable laptop</a></div><div class="product-infomation"> Description </div></div><div class="product-info-price"> <span class="price"> <ins>Rs.229.00</ins> </span> <div class="single-add-to-cart"> <a href="#" class="btn-add-to-cart">Add to cart</a> <a href="#" class="wishlist"><i class="fa fa-heart-o" aria-hidden="true"></i>Add to Wishlist</a> </div></div></div>';
        }
        shopList.append(form);
    };
    $('#page-limit').on('change', function() {
        loadProducts();
    })
});