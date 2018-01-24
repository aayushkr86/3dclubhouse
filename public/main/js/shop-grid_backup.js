/**
 * Created by anoojmon on 26/06/17.
 */
jQuery('document').ready(function () {
    let $               =   jQuery;
    let interestedCarousel=   $("#interested-carousel-test");
    let pageLimit        =   $("#page-limit");
    let apiEndPoints=   {
        getAllCategories:'/user/categories/getallcategories',
        getRecentProductsOfCat:'/user/categories/getrecentproductsoncat'
    };
    var categories  =   [],recentProducts=[];
    init();


    function init(){
        loadProductsCarousel();
    };

    function loadProductsCarousel(){
        interestedCarousel.empty();
        var form="";
        var item="";
        //active or 1st slide of carousel
        form = '<div class="item active"> <div class="col-xs-12 col-sm-4 col-md-4 gp_products_item"> <div class="row"> <div class="col-xs-12 col-sm-6 col-md-6"> <div class="gp_products_inner"> <div class="gp_products_item_image"> <a href="#"> <img src="/main/car_images/gp_product_001.png" alt="gp product 001"/> </a> </div><div class="gp_products_item_caption"> <ul class="gp_products_caption_name"> <li><a href="#">Lorem ipsum dolor</a></li><li><a href="#">sz_themes</a></li></ul> <ul class="gp_products_caption_rating"> <li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-half-o"></i></li><li class="pull-right"><a href="#">free</a></li></ul> </div></div></div><div class="col-xs-12 col-sm-6 col-md-6"> <div class="gp_products_inner"> <div class="gp_products_item_image"> <a href="#"> <img src="/main/car_images/gp_product_002.png" alt="gp product 002"/> </a> </div><div class="gp_products_item_caption"> <ul class="gp_products_caption_name"> <li><a href="#">Lorem ipsum dolor</a></li><li><a href="#">sz_themes</a></li></ul> <ul class="gp_products_caption_rating"> <li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-half-o"></i></li><li class="pull-right"><a href="#">free</a></li></ul> </div></div></div></div></div></div>';

        for(var i=0;i< 6 ;i++) {
                form += '<div class="item"> <div class="col-xs-12 col-sm-4 col-md-4 gp_products_item"> ' +
                    '<div class="row"> <div class="col-xs-12 col-sm-6 col-md-6"> <div class="gp_products_inner"> ' +
                    '<div class="gp_products_item_image"> <a href="#"> ' +
                    '<img src="/main/car_images/gp_product_001.png" alt="gp product 001"/> </a> ' +
                    '</div><div class="gp_products_item_caption"> <ul class="gp_products_caption_name"> ' +
                    '<li><a href="#">Lorem ipsum dolor</a></li><li><a href="#">sz_themes</a></li></ul> ' +
                    '<ul class="gp_products_caption_rating"> <li><i class="fa fa-star"></i></li>' +
                    '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li>' +
                    '<i class="fa fa-star"></i></li><li><i class="fa fa-star-half-o"></i></li>' +
                    '<li class="pull-right"><a href="#">free</a></li></ul> </div></div></div>' +
                    '<div class="col-xs-12 col-sm-6 col-md-6"> <div class="gp_products_inner"> ' +
                    '<div class="gp_products_item_image"> <a href="#"> ' +
                    '<img src="/main/car_images/gp_product_002.png" alt="gp product 002"/> </a>' +
                    ' </div><div class="gp_products_item_caption"> <ul class="gp_products_caption_name"> ' +
                    '<li><a href="#">Lorem ipsum dolor</a></li><li><a href="#">sz_themes</a></li></ul>' +
                    ' <ul class="gp_products_caption_rating"> <li><i class="fa fa-star"></i></li><li>' +
                    '<i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li>' +
                    '<i class="fa fa-star"></i></li><li><i class="fa fa-star-half-o"></i></li>' +
                    '<li class="pull-right"><a href="#">free</a></li></ul> </div></div></div></div></div></div>';
        }
        interestedCarousel.append(form);
    };
    $('#page-limit').on('change', function() {
        loadProducts();
    })
});