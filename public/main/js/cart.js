/**
 * Created by anooj on 28/06/17.
 */
$('document').ready(function () {

    //
    var imageUploadTapped   =   false;
    var ImageUploadData;
    var isImageUploaded =   true;
    var productImagesArray=[];
    var productArray    =   [];
    var productIdsArray    =   [];
    var deletedIds  =   [],addedImages=[];
    var isNewImageSelected  =   false;
    var imageDeleted    =   false;
    var materialCost    =   {};
    let productMaterial =   $("#prod-detail-material-in");
    let productColor    =   $("#prod-detail-color");
    let productQuality  =   $("#prod-detail-quality");
    let productQuantity =   $("#product-quantity");
    //


    var currentProductId;
    var productImages   =   [];
    var currentCartIds  =   [];
    var cartInfo        =   [];
    var isCouponApplied =   false;
    let body            =   $("body");
    let cartCountId     =   $(".cart-count");
    let cartPriceId     =   $("#cart-price");
    let currentPath     =   window.location.pathname + window.location.search;
    let apiEndPoint     =   {
        addToCart:'/cart/addtocart',
        getCart:'/cart/getusercart',
        removeCart:'/cart/removecart',
        updateCart:'/cart/updatecart',
        getWishList:'/cart/getmywishlist',
        applyCoupon:'/cart/applycoupon',
        getallorders:'/cart/getallmyorders'
    };
    if(currentPath.indexOf("/cart") != -1){
        cartInfo    =   $("#cart-main-container").attr("cartinfo");
        if(cartInfo != null && cartInfo != undefined) {
            cartInfo = JSON.parse(cartInfo);
            console.log("Page Cart", cartInfo);
            calculatePrice();
            buildTotalCartUI();
        }
    }else if(currentPath.indexOf("/wishlist") != -1){
        var wishInfo    =   $("#wish-main-container").attr("wishinfo");
        if(wishInfo != null && wishInfo != undefined) {
            wishInfo = JSON.parse(wishInfo);
            console.log("Page WISH ", wishInfo);
            buildWishListUI(wishInfo);
            //calculatePrice();
            //buildTotalCartUI();
        }
    }else if(currentPath.indexOf("/myaccount-orders") != -1){
        getMyOrders();
    }

    function getMyOrders() {
        $("div#divLoading").addClass('show');
        $.ajax({
            url:apiEndPoint.getallorders,
            type:'GET',
            success:function (orderResp) {
                console.log("OrderResp: ",orderResp);
                $("div#divLoading").removeClass('show');
                if(orderResp.success){
                    builOrdersView(orderResp.data);
                }
            }
        })
    }

    function builOrdersView(orderResp) {
        //<tr><td class=tb-image><a href=# class=item-photo><img alt=cart src=/main/images/cart2.jpg></a><td class=tb-product><div class=product-name><a href=/product>Acer's Aspire S7 is a thin and portable laptop</a></div><td class=tb-price><span class=price></span><td class=tb-qty><td class=tb-total><span class=price>Rs.229.00</span><td class=tb-remove></table></div>
        //<div class=cart-actions>Status : <strong>Shipped</strong></div>
        var orderForm = "";
        for(var i=0;i<orderResp.length;i++){
            var mainOrder = orderResp[i];
            console.log(mainOrder)
            var currentMainOrderStatus  =   mainOrder.orderStatus;
            var currentMainOrderDate    =   mainOrder.orderedOn;
            currentMainOrderDate        =   currentMainOrderDate.split("T");
            currentMainOrderDate        =   currentMainOrderDate[0];
            var currentMainOrderPrice   =   "Rs. "+mainOrder.discountedAmount;
            if(mainOrder.discountedAmount == null || mainOrder.discountedAmount == undefined){
                currentMainOrderPrice   =   "Rs. "+mainOrder.totalAmount;
            }
            var currentMainOrderNumber  =   "#"+mainOrder.orderGroupId;

            orderForm   += "<div class='form-cart'><div class=table-cart><table class=table><thead><tr><th class=tb-image><th class=tb-product><p>Order Placed on <strong>"+currentMainOrderDate+"</strong><th class=tb-qty><th class=tb-qty>Total Price : <strong>"+currentMainOrderPrice+"</strong><th class=tb-total><th class=tb-remove>Order "+currentMainOrderNumber+"<tbody>";

            var ordersOfCurrent         =   mainOrder.orders;
            var orderArrForm            =   "";
            for(var j=0;j<ordersOfCurrent.length;j++){
                var currentOrderInfo = ordersOfCurrent[j];
                var img =   currentOrderInfo.defaultImage;
                if(img == null || img == undefined || img == ""){
                    img = "/main/images/3d.png"
                }
                orderArrForm += "<tr><td class=tb-image><a href=# class=item-photo><img alt=cart src="+img+">" +
                    "</a><td class=tb-product><div class=product-name>" +
                    "<a href=/product?id="+currentOrderInfo.pkProductId+">"+currentOrderInfo.productName+"</a></div><td class=tb-price>" +
                    "<span class=price></span><td class=tb-qty><div class=quantity>" +
                    "</div><td class=tb-total><span class=price>Rs. "+currentOrderInfo.calculatedTotalPrice+"</span><td class=tb-remove>";
            }
            orderForm   += orderArrForm+"</table></div>";
            orderForm   += "<div class=cart-actions>Status : <strong>"+currentMainOrderStatus+"</strong></div></div>"
        }
        $("#order_container").append(orderForm);
    }

    function buildWishListUI(wishInfo) {
        var form    =   '';
        $("div#divLoading").addClass('show');
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
        $("div#divLoading").removeClass('show');
    }

    function getUserCart() {
        $.ajax({
            url:apiEndPoint.getCart,
            type:'POST',
            data:{},
            success:function (cart) {
                console.log("CART: ",cart)
                if(cart.success == true && cart.data != undefined) {
                    cartInfo    =   cart.data;
                    calculatePrice();
                }
            }
        })
    }
    function buildTotalCartUI() {
        $("div#divLoading").addClass('show');
        var form    =   '';
        $("#cart-detail-view").empty();
        var totalPrice  =   0;
        for(var i=0;i<cartInfo.length;i++){
            var multipliedPrice =   parseInt(cartInfo[i].quantity)*parseInt(cartInfo[i].calculatedPrice)
            totalPrice+=(parseInt(cartInfo[i].quantity)*parseInt(cartInfo[i].calculatedPrice));
            form+='<tr id="cart_'+cartInfo[i].pkUserCartId+'"><td class=tb-image><a href=# class=item-photo>' +
                '<img alt=cart src='+cartInfo[i].defaultImage+'></a>' +
                '<td class=tb-product><div class=product-name>' +
                '<a href=/product?id='+cartInfo[i].pkProductId+'>'+cartInfo[i].productName+'</a></div>' +
                '<td class=tb-price><span id="minprice_'+cartInfo[i].pkUserCartId+'" price="'+cartInfo[i].calculatedPrice+'" class=price>Rs.'+cartInfo[i].calculatedPrice+'</span><td class=tb-qty>' +
                '<div class=quantity><div class=buttons-added>' +
                '<input id="quantity_'+cartInfo[i].pkUserCartId+'" class="input-text qty text" size=1 title=Qty value='+cartInfo[i].quantity+'> ' +
                '<a id="'+cartInfo[i].pkUserCartId+'" href=# class="sign plus quantity-plus">' +
                '<i class="fa fa-plus"></i></a> <a id="'+cartInfo[i].pkUserCartId+'" href=# class="sign minus quantity-minus"><i class="fa fa-minus"></i></a>' +
                '</div></div><td class=tb-total><span id="multprice_'+cartInfo[i].pkUserCartId+'" class=price>Rs.'+multipliedPrice+'</span><td class=tb-remove>' +
                '<a id="'+cartInfo[i].pkUserCartId+'" href=# class="action-remove remove-cart"><span><i class="fa fa-times"aria-hidden=true></i></span></a>';
        }
        $("#cart-detail-view").append(form)
        $("#cart-total-price").text("Rs."+totalPrice)
        $("div#divLoading").removeClass('show');
    }

    $(".remove-cart").click(function () {
        var deleteId    =   $(this).attr("id");
        deleteCart(deleteId);
    });

    function deleteCart(deleteId) {
        $("div#divLoading").addClass('show');
        $("#cart_"+deleteId).hide();
        $.ajax({
            url:apiEndPoint.removeCart,
            type:'POST',
            data:{pkUserCartId:deleteId},
            success:function (data) {
                $("div#divLoading").removeClass('show');
                if(data.success){
                    $("#cart_"+deleteId).empty();
                    getUserCart();
                }else{
                    $("#cart_"+deleteId).show();
                }
            }
        })
    }
    function calculatePrice() {
        var totalPrice  =   0;
        for(var i=0;i<cartInfo.length;i++) {
            var multipliedPrice = parseInt(cartInfo[i].quantity) * parseInt(cartInfo[i].calculatedPrice)
            totalPrice += multipliedPrice;
        }
        $("#cart-total-price").text("Rs."+totalPrice)
        cartCountId.text(cartInfo.length);
        cartPriceId.text("Rs."+totalPrice);
        if(cartInfo.length == 0){
            window.location.reload();
        }
    }

    $("#checkout-btn").click(function () {
        window.location.href='/checkout';
    })

    $(".quantity-plus").click(function () {
        var currentCartId   =   $(this).attr('id');
        var currentQuantity =   $("#quantity_"+currentCartId).val();
        currentQuantity++;
        var minPrice    =   $("#minprice_"+currentCartId).attr('price');
        minPrice    =   parseFloat(minPrice);
        minPrice    =   currentQuantity*minPrice;
        $("#multprice_"+currentCartId).text("Rs."+minPrice);
        updateCartQuantity(currentCartId,currentQuantity);
    });
    $(".quantity-minus").click(function () {
        var currentCartId   =   $(this).attr('id');
        var currentQuantity =   $("#quantity_"+currentCartId).val();
        currentQuantity--;
        if(currentQuantity == 0){
            deleteCart(currentCartId);
        }else{
            var minPrice    =   $("#minprice_"+currentCartId).attr('price');
            minPrice    =   parseFloat(minPrice);
            minPrice    =   currentQuantity*minPrice;
            $("#multprice_"+currentCartId).text("Rs."+minPrice);
            updateCartQuantity(currentCartId,currentQuantity);

        }
    });
    function updateCartQuantity(cartId,quantity) {
        $("div#divLoading").addClass('show');
        $.ajax({
            url:apiEndPoint.updateCart,
            type:'POST',
            data:{pkUserCartId:cartId,quantity:quantity},
            success:function (data) {
                console.log("Current: ",data)
                $("div#divLoading").removeClass('show');
                if(data.success){
                    getUserCart();
                }
            }
        })
    }

    $("#apply-coupon").click(function (e) {
        if(!isCouponApplied) {
            var couponCode = $("#coupon-text").val();
            if (couponCode != "") {
                $("div#divLoading").addClass('show');
                $.ajax({
                    url: apiEndPoint.applyCoupon,
                    type: 'POST',
                    data: {
                        couponName: couponCode
                    },
                    success: function (status) {
                        console.log(status);
                        $("div#divLoading").removeClass('show');
                        var pin = $("#ship-pincode").val();
                        if (pin != "") {
                            if (status.success) {

                                var couponIfnfo = status.data;
                                pin = parseInt(pin);
                                if (pin >= couponIfnfo.pincodeStart && pin <= couponIfnfo.pincodeEnd) {
                                    var total = $("#grant-total").attr("grand");
                                    total = parseFloat(total);
                                    if (total >= couponIfnfo.minimumProductPrice) {
                                        var amountAfter = total;
                                        if (couponIfnfo.reductionAmount != 0) {
                                            amountAfter = total - parseFloat(couponIfnfo.reductionAmount);
                                        } else if (couponIfnfo.reductionInPercent != 0) {
                                            var percentGrant = (parseFloat(couponIfnfo.reductionInPercent) / 100) * total;
                                            amountAfter = total - percentGrant;
                                        } else {
                                            alert("Coupon no longer valid");
                                        }
                                        if (amountAfter != total) {
                                            $("#grant-total").text("Rs." + amountAfter);
                                            $("#coupon-text").attr("name", "couponCode");
                                            alert("Coupon applied successfully")
                                            isCouponApplied = true;
                                        }
                                    }

                                } else {
                                    alert("Coupon invalid for " + pin);
                                }
                            } else {
                                alert("Invalid Coupon")
                            }
                        } else {
                            alert("Invalid Pincode")
                        }
                    }
                });
            }
        }else{
            alert("Coupon applied")
        }
    });
    // $("#place-order").click(function () {
    //     $.ajax({
    //         url:'/checkout/payment',
    //         type:'POST',
    //         data:{},
    //         success:function (data) {
    //             console.log(data);
    //         }
    //     })
    //     window.location.href='';
    // })




    

});