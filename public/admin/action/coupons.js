/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {

    var isNewImageSelected  =   false;
    var imageDeleted    =   false;
    var isEdit  =   false;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/coupons?id=") != -1){
        isEdit  =   $("#coupons-submit").attr("isEdit");
    }
    if(currentPath.indexOf("/admin/adminfaq?id=") != -1){
        isEdit  =   $("#faq-submit").attr("isEdit");
    }

    getCoupons();
    getFAQs();


    $("#coupons-submit").click(function () {
        isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
                updateCoupon();
        }else {
                createCoupon();
        }

    });

    $("#faq-submit").click(function () {
        isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
            updateFAQ();
        }else {
            createFAQ();
        }

    });


    function updateFAQ() {
        var colorName    =   $("#colorName").val();
        var colorObj     =   {
            colorName:colorName
        };

        var catId   =   $("#color-submit").attr("colorId");
        colorObj.pkColorId    =   catId;
        $.ajax({
            url: '/admin/colors/updatecolor',
            type: 'POST',
            data: colorObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully updated");
                        window.location.href    =   '/admin/admincolors';
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }
    function updateCoupon() {
        var couponCode    =   $("#coupon-code").val();
        var pincodeStart    =   $("#coupon-pinstart").val();
        var pincodeEnd    =   $("#coupon-pinend").val();
        var startsOn    =   $("#coupon-startdate").val();
        var endsOn    =   $("#coupon-enddate").val();
        var status    =   $("#coupon-status option:selected").val();


        var couponObj     =   {
            couponCode:couponCode,
            pincodeStart:pincodeStart,
            pincodeEnd:pincodeEnd,
            minimumProductPrice:$("#coupon-minproductcost").val(),
            reductionAmount:$("#coupon-reductionamt").val(),
            reductionInPercent:$("#coupon-reductionperc").val(),
            maxReductionAmount:$("#coupon-maxreductionamt").val(),
            startsOn:startsOn,
            endsOn:endsOn,
            status:status
        };
        var catId   =   $("#coupons-submit").attr("pkCouponId");
        couponObj.pkCouponId    =   catId;
        $.ajax({
            url: '/admin/product/updatecoupon',
            type: 'POST',
            data: couponObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully updated");
                        window.location.href    =   '/admin/coupons';
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }
    function createCoupon() {
        var couponCode    =   $("#coupon-code").val();
        var pincodeStart    =   $("#coupon-pinstart").val();
        var pincodeEnd    =   $("#coupon-pinend").val();
        var startsOn    =   $("#coupon-startdate").val();
        var endsOn    =   $("#coupon-enddate").val();
        var status    =   $("#coupon-status option:selected").val();


        var couponObj     =   {
            couponCode:couponCode,
            pincodeStart:pincodeStart,
            pincodeEnd:pincodeEnd,
            minimumProductPrice:$("#coupon-minproductcost").val(),
            reductionAmount:$("#coupon-reductionamt").val(),
            reductionInPercent:$("#coupon-reductionperc").val(),
            maxReductionAmount:"",
            startsOn:startsOn,
            endsOn:endsOn,
            status:status
        };
        $.ajax({
            url: '/admin/product/createcoupon',
            type: 'POST',
            data: couponObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully added");
                        //$("#materialName").val("");
                        window.location.reload();
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }
    function createFAQ() {
        var colorName    =   $("#colorName").val();

        var colorObj     =   {
            colorName:colorName
        };
        $.ajax({
            url: '/admin/colors/addcolor',
            type: 'POST',
            data: colorObj,
            success: function (data) {
                console.log(data)
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully added");
                        $("#colorName").val("");
                        window.location.reload();
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to add");
                }
            }
        })
    }


    $("#view-all-coupons-list").click(function (e) {
        getCoupons();
    });

    $("#view-all-faq-list").click(function (e) {
        getFAQs();
    });


    function getFAQs() {
        $.ajax({
            url:'/admin/colors/getallcolors',
            type:'GET',
            success:function (categoryResult) {
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildFAQList(categories);
                }
            }
        });
    }
    function buildFAQList(faqs) {
        var categoriesForm  =   "";
        $("#color-list-container").empty();
        for(var i=0;i<faqs.length;i++){
            console.log(faqs[i])
            var currentCategory =   faqs[i];
            var categoryId  =   currentCategory.pkColorId;

            categoriesForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+currentCategory.colorName+"</td>"+
                "<td><a class='btn btn-default' href='/admin/admincolors?col="+categoryId+"'><i class='fa fa-fw fa-edit'></i></a></td>";
        }
        $("#color-list-container").append(categoriesForm);
    }

    function getCoupons() {
        $.ajax({
            url:'/admin/product/getcoupons',
            type:'GET',
            success:function (categoryResult) {
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildCouponsList(categories);
                }
            }
        });
    }
    function buildCouponsList(coupons) {
        var categoriesForm  =   "";
        $("#coupon-list-container").empty();
        for(var i=0;i<coupons.length;i++){
            console.log(coupons[i])
            var currentCoupon =   coupons[i];
            var pkCouponId  =   currentCoupon.pkCouponId;
            var status  =   currentCoupon.status;
            if(status == 1 || status == "1"){
                status  =   "Pending"
            }else if(status == 2 || status == "2"){
                status  =   "Ongoing"
            }else if(status == 3 || status == "3"){
                status  =   "Ended"
            }

            categoriesForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+currentCoupon.couponCode+"</td>"+
                "<td>"+currentCoupon.pincodeStart+"</td>"+
                "<td>"+currentCoupon.pincodeEnd+"</td>"+
                "<td>"+currentCoupon.startsOn+"</td>"+
                "<td>"+currentCoupon.endsOn+"</td>"+
                "<td>"+status+"</td>"+
                "<td><a class='btn btn-default' href='/admin/coupons?id="+pkCouponId+"'><i class='fa fa-fw fa-edit'></i></a></td>";
        }
        $("#coupon-list-container").append(categoriesForm);
    }


    $('body').on('click','.deletecoupon',function () {
        var categoryId  =   $(this).attr("id");
        $.ajax({
            url:'/admin/categories/deletecategory',
            type:'POST',
            data:{pkCategoryId:categoryId},
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
    });


});