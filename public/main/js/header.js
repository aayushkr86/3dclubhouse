/**
 * Created by anooj on 26/06/17.
 */
jQuery('document').ready(function () {
    let $               =   jQuery;
    let menuUI          =   $("#primary-menu");
    let featuredCat     =   $("#featured-categories");
    let searchCatMenu   =   $("#search-cats");
    let prodDetailMaterial  =   $("#prod-detail-material")
    let prodDetailColor  =   $("#prod-detail-color")
    let featuredCatTab  =   ".feat-cats";
    var currentSelectedCatId    =   "";
    let body            =   $('body');
    let featuredProducts=   $("#interested-carousel");//$("#interested-carousel");//$("#recent-products-container");
    let searchId        =   $("#search-header");
    let searchBtn        =   $("#search-btn");
    let currentPath     =   window.location.pathname + window.location.search;
    var isShopPage      =   false;
    var categoryIdFromSearch    =   0;
    console.log(currentPath)
    if(currentPath.indexOf("shop?category=") != -1){
        isShopPage  =   true;
        categoryIdFromSearch    =   getParameterByName("category");
    }else if(currentPath.indexOf("product?id=") != -1){
        //isShopPage  =   true;
        //categoryIdFromSearch    =   getParameterByName("id");
    }
    let apiEndPoints=   {
        getAllCategories:'/user/categories/getallcategories',
        getRecentProductsOfCat:'/user/categories/getrecentproductsoncat',
        getAllColors    :   '/admin/colors/getallcolors',
        getAllMaterials :   '/admin/materials/getallmaterials'
    };
    var categories  =   [],recentProducts=[],allColors=[],allMaterials=[];
    init();


    function init(){
        loadCategories();
        loadColors();
        loadMaterials();
        if(isShopPage){
            loadRecentProductsFromCat(categoryIdFromSearch)
        }
    }


    function loadColors() {
        $.ajax({
            url:apiEndPoints.getAllColors,
            type:'GET',
            success:function (colors) {
                if(colors.success != undefined && colors.success== true){
                    allColors   =   colors.data;
                    buildColorsUI();
                }
            }
        });
    }
    function loadMaterials() {
        $.ajax({
            url:apiEndPoints.getAllMaterials,
            type:'GET',
            success:function (materials) {
                if(materials.success != undefined && materials.success== true){
                    allMaterials    =   materials.data;
                    buildMaterialsUI();
                }
            }
        });
    }
    function loadCategories() {
        $.ajax({
           url:apiEndPoints.getAllCategories,
            type:'GET',
            success:function (data) {
                console.log("Categories : ",data);
                if(data.success){
                    categories  =   data.data;
                    buildHeaderCategoriesUI();
                    buildFeaturedCategoriesUI();
                    buildCategoriesToSearchUI();
                }
            }
        });
    };

    function buildColorsUI() {
        prodDetailColor.empty();
        for(var i=0;i<allColors.length;i++){
            prodDetailColor.append("<option value='"+allColors[i].pkColorId+"'>"+allColors[i].colorName+"</option>")
        }
    }
    function buildMaterialsUI() {
        prodDetailMaterial.empty();
        for(var i=0;i<allMaterials.length;i++){
            prodDetailMaterial.append("<option value='"+allMaterials[i].pkMaterialId+"' isBase='"+allMaterials[i].isBaseMaterial+"' cost='"+allMaterials[i].materialCost+"' >"+allMaterials[i].materialName+"</option>")
        }
    }
    // prodDetailMaterial.on('change', function() {
    //     alert('jjuuu')
    // });
    function buildCategoriesToSearchUI() {
        searchCatMenu.empty();
        console.log(searchCatMenu)
        //searchCatMenu.append('<option value="">All Categories</option>');
        for(var i=0;i<categories.length;i++){
            searchCatMenu.append('<option value="'+categories[i].pkCategoryId+'">'+categories[i].categoryName+'</option>')
        }
    }
    function loadRecentProductsFromCat(categoryId) {
        $.ajax({
            url:apiEndPoints.getRecentProductsOfCat,
            type:'POST',
            data:{categoryId:categoryId},
            success:function (data) {
                console.log("recentProducts : ",data);
                if(data.success){
                    recentProducts  =   data.data;
                    buildRecentProducts();
                }
            }
        });
    };

    function buildHeaderCategoriesUI() {
        menuUI.empty();
        var form    =   '';
        for(var i=0;i<categories.length;i++){
            form+='<li class=menu-item-has-no-children><a href="/shop?category='+categories[i].pkCategoryId+'&viewtype=grid">'+categories[i].categoryName+'</a>'
            //form+='<li class="menu-item-1191 aligned-left"><a href="/shop">'+categories[i].categoryName+'</a></li>';
        }
        menuUI.append(form);
    }
    function buildFeaturedCategoriesUI() {
        featuredCat.empty();
        var form    =   '';
        for(var i=0;i<categories.length;i++){
            var index   =   i+1;
            if(index == 1) {
                currentSelectedCatId    =   categories[i].pkCategoryId;
                form+='<li id="'+categories[i].pkCategoryId+'" class="active feat-cats"><a id="cat_'+categories[i].pkCategoryId+'" data-animated="" data-toggle="tab" href="#tab-'+index+'">' + categories[i].categoryName +'</a></li>'
                //form += '<li style="cursor: pointer" id="'+categories[i].pkCategoryId+'" class="feat-cats active"><a id="cat_'+categories[i].pkCategoryId+'" temp=#tab-QmC5z-' + index + '>' + categories[i].categoryName + '</a></li>';
                if(isShopPage==false)
                    loadRecentProductsFromCat(categories[i].pkCategoryId);
            }
            else
                form+='<li style="cursor: pointer" id="'+categories[i].pkCategoryId+'" class="feat-cats" ><a id="cat_'+categories[i].pkCategoryId+'" temp="#tab-QmC5z-'+index+'">'+categories[i].categoryName+'</a></li>';
        }
        featuredCat.append(form);
    }
    function buildRecentProducts() {
        var form    =   "";
        //$("#recent_carousel_div").empty();
        featuredProducts.empty();
        // for(var i=0;i<recentProducts.length;i++){
        //     var product =   recentProducts[i];
        //     form+='<div class="product-item style1"><div class="equal-elem product-inner"><div class=product-thumb>' +
        //         '<div class=thumb-inner><a href=/product?id='+product.pkProductId+'><img alt=p1 src='+product.defaultImage+'></a></div>' +
        //         '<span class=onsale>-50%</span></div><div class=product-innfo><div class=product-name>' +
        //         '<a href=/product?id='+product.pkProductId+'>'+product.productName+'</a></div>' +
        //         '<span class=price><ins>Rs.229.00</ins> <del>Rs.259.00</del></span>' +
        //         '<div class=group-btn-hover><div class=inner><a href=# class=add-to-cart>Add to cart</a> ' +
        //         '<a href=# class=wishlist><i aria-hidden=true class="fa fa-heart-o"></i></a></div></div></div></div></div>';
        //
        // }

        // form = '<div class="item active"> <div class="col-xs-12 col-sm-4 col-md-4 gp_products_item">' +
        //     ' <div class="row"> <div class="col-xs-12 col-sm-6 col-md-6"> <div class="gp_products_inner"> ' +
        //     '<div class="gp_products_item_image"> <a href="#"> ' +
        //     '<img src="/main/car_images/gp_product_001.png" alt="gp product 001"/> </a> ' +
        //     '</div><div class="gp_products_item_caption"> <ul class="gp_products_caption_name"> ' +
        //     '<li><a href="#">Lorem ipsum dolor</a></li><li><a href="#">sz_themes</a></li></ul> ' +
        //     '<ul class="gp_products_caption_rating"> <li><i class="fa fa-star"></i></li><li>' +
        //     '<i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star">' +
        //     '</i></li><li><i class="fa fa-star-half-o"></i></li><li class="pull-right"><a href="#">free</a></li></ul> </div></div></div><div class="col-xs-12 col-sm-6 col-md-6"> <div class="gp_products_inner"> <div class="gp_products_item_image"> <a href="#"> <img src="/main/car_images/gp_product_002.png" alt="gp product 002"/> </a> </div><div class="gp_products_item_caption"> <ul class="gp_products_caption_name"> <li><a href="#">Lorem ipsum dolor</a></li><li><a href="#">sz_themes</a></li></ul> <ul class="gp_products_caption_rating"> <li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-half-o"></i></li><li class="pull-right"><a href="#">free</a></li></ul> </div></div></div></div></div></div>';
        console.log("prLeng: ",recentProducts.length);
        for(var i=0;i< recentProducts.length;i++) {
            console.log("pr: ",recentProducts[i]);
            form += '<div class="col-md-6 col-sm-6 col-xs-12"><div class=gp_products_inner>' + '<div class=gp_products_item_image><a href="/product?id='+recentProducts[i].pkProductId+'">' +
                '<img alt="gp product 001" src='+recentProducts[i].defaultImage+'></a>' + '</div><div class=gp_products_item_caption><ul class=gp_products_caption_name><li>' + '<center><span style="font-weight: bold;"><a href="/product?id='+recentProducts[i].pkProductId+'">'+recentProducts[i].productName+'</a></span></center></li></ul></div>' + '</div></div>';
        }
        featuredProducts.append(form)
    }

    body.on("click",featuredCatTab,function () {
        
        let currentCatId    =   ($(this).attr("id"));
        $("#"+currentSelectedCatId).removeClass("active");
        currentSelectedCatId    =   currentCatId;
        $("#"+currentSelectedCatId).addClass("active");
        loadRecentProductsFromCat(currentCatId);
    });

    searchBtn.click(function () {
        var searchName  =   searchId.val();
        if(searchName != ""){
            performSearch(searchName);
        }
    });

    function performSearch(searchName) {
        var catId              =   $("#search-cats option:selected").val();
        var searchURL   =   window.location.protocol+"//"+window.location.host+"/shop?category="+catId+"&viewtype=grid&search="+searchName;
        console.log(searchURL);
        console.log(window.location.protocol);
        window.location.href    =   searchURL;
    }

    function getParameterByName( name ){
        var regexS = "[\\?&]"+name+"=([^&#]*)",
            regex = new RegExp( regexS ),
            results = regex.exec( window.location.search );
        if( results == null ){
            return "";
        } else{
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }
});