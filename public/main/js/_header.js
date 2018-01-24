/**
 * Created by anooj on 26/06/17.
 */
jQuery('document').ready(function () {
    let $               =   jQuery;
    let menuUI          =   $("#primary-menu");
    let featuredCat     =   $("#featured-categories");
    let searchCatMenu   =   $("#search-cats");
    let featuredCatTab  =   ".feat-cats";
    let body            =   $('body');
    let featuredProducts=   $("#recent-products-container");
    let apiEndPoints=   {
        getAllCategories:'/user/categories/getallcategories',
        getRecentProductsOfCat:'/user/categories/getrecentproductsoncat'
    };
    var categories  =   [],recentProducts=[];
    init();


    function init(){
        loadCategories();
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
                    buildFeaturedCategoriesUI()
                    buildCategoriesToSearchUI();
                }
            }
        });
    };

    function buildCategoriesToSearchUI() {
        searchCatMenu.empty();
        console.log(searchCatMenu)
        searchCatMenu.append('<option value="">All Categories</option>');
        for(var i=0;i<categories.length;i++){
            searchCatMenu.append('<option id="'+categories[i].pkCategoryId+'">'+categories[i].categoryName+'</option>')
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
            form+='<li class=menu-item-has-no-children><a href=/shop>'+categories[i].categoryName+'</a>'
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
                form+='<li id="'+categories[i].pkCategoryId+'" class="active feat-cats"><a id="cat_'+categories[i].pkCategoryId+'" data-animated="fadeInLeft" data-toggle="tab" href="#tab-'+index+'">' + categories[i].categoryName +'</a></li>'
                //form += '<li style="cursor: pointer" id="'+categories[i].pkCategoryId+'" class="feat-cats active"><a id="cat_'+categories[i].pkCategoryId+'" temp=#tab-QmC5z-' + index + '>' + categories[i].categoryName + '</a></li>';
                loadRecentProductsFromCat(categories[i].pkCategoryId);
            }
            else
                form+='<li style="cursor: pointer" id="'+categories[i].pkCategoryId+'" class="feat-cats" ><a id="cat_'+categories[i].pkCategoryId+'" temp="#tab-QmC5z-'+index+'">'+categories[i].categoryName+'</a></li>';
        }
        featuredCat.append(form);
    }
    function buildRecentProducts() {
        var form    =   "";
        featuredProducts.empty();
        form='<div class="owl-stage-outer"> <div class="owl-stage" style="transition: 0s; width: 3510px;"><div class="owl-item cloned" style="width: 234px; margin-right: 0px;"><div class="owl-one-row">';
        for(var i=0;i<recentProducts.length;i++){
            var product =   recentProducts[i];
            form+='<div class="product-item style1"><div class="equal-elem product-inner"><div class=product-thumb>' +
                '<div class=thumb-inner><a href=/product/id='+product.pkProductId+'><img alt=p1 src='+product.pro+'></a></div>' +
                '<span class=onsale>-50%</span></div><div class=product-innfo><div class=product-name>' +
                '<a href=/product>Skullcandy Headphone Grind Wireless (White)</a></div>' +
                '<span class=price><ins>Rs.229.00</ins> <del>Rs.259.00</del></span>' +
                '<div class=group-btn-hover><div class=inner><a href=# class=add-to-cart>Add to cart</a> ' +
                '<a href=# class=wishlist><i aria-hidden=true class="fa fa-heart-o"></i></a></div></div></div></div></div>';
        }
        form+='</div></div></div></div>';
        featuredProducts.append(form)
    }

    body.on("click",featuredCatTab,function () {
        let currentCatId    =   ($(this).attr("id"));
        loadRecentProductsFromCat(currentCatId);
    })
});