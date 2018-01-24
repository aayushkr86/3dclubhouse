
var productManager =   require('../dataAccessLayer/userCartDA');
var studentManager =   require('../dataAccessLayer/studentUserDA');
var Queue = require('bull');
var shippingQueue   =   new Queue('shipping', 'redis://127.0.0.1:6379');
shippingQueue.process(function (job, done) {
    console.log("Job Queue: Shipping")
    console.log(job.data);
    var orderInfo  =   job.data.orderInfo;
    var userId     =   orderInfo.fkUserId;

    studentManager.getShippingAddress(userId,function (err, addr) {
        addr    =   addr[0];
        var orderObj    =   buildShipRocketOrderObject(orderInfo,addr,userId);
        var shipRocketManager   =   require('../dataAccessLayer/shipRocketManager');
        shipRocketManager.placeOrder(orderObj,function (shipRocketResp) {
            if(shipRocketResp.order_id != undefined && shipRocketResp.shipment_id != undefined){
                var updateInfo  =   {
                    shipmentId:shipRocketResp.shipment_id,
                    shipOrderId:shipRocketResp.order_id
                };
                productManager.updateGroupOrder(userId,orderInfo.orderGroupId,updateInfo,function (er, stat) {
                    done();
                })
            }else{
                done();
            }

        });

    });

});


exports.getProductsFromId =   function (productId,callback) {
    productManager.getProductsFromId(productId,function (err, productBasicInfo,images) {
            callback(err,productBasicInfo,images);
    });
};


exports.addToCart =   function (productData, callback) {
    productManager.getProductBasedCart(productData,function (err, carts) {
        if(carts.length == 0) {
            addingToCart(productData, function (err, status) {
                getCart(productData.fkUserId,function (err, cartInfo) {
                    callback(err, cartInfo);
                })

            })
        }else{
            productData.pkUserCartId    =   carts[0].pkUserCartId;
            var quantity    =   parseInt(carts[0].quantity);
            quantity+=   parseInt(productData.quantity);
            productData.quantity    =   quantity;
            productManager.updateCart(productData, function (err, stats) {
                getCart(productData.fkUserId,function (err, cartInfo) {
                    callback(err, cartInfo);
                })
            })
        }
    });
};

exports.addToCartBulk =   function (productData, callback) {
    var async   =   require('async');
    if(productData.length > 0) {
        var _status  =   [];
        async.eachSeries(productData,function (product, finish) {
            addingToCart(product, function (err, status) {
                var stat    =   {};
                stat.product    =   product;
                stat.status     =   status;
                _status.push(stat);
                finish();
            })
        },function (err) {
            callback(false,_status);
        })

    }else{
        callback(true,"No enough products to add");
    }
};

exports.getTotalCart    =   function (userId, callback) {
   getCart(userId,function (err, status) {
       callback(err,status);
   })
};

exports.changeOrderStatus   =   function (orderId, orderStatus, callback) {
    productManager.changeOrderStatus(orderId,orderStatus,function (err, orderInfo) {
        if(!err && orderInfo != undefined && orderInfo.length >0){
            orderInfo   =   orderInfo[0];
            var userId  =   orderInfo.fkUserId;
            var grpId   =   orderInfo.orderGroupId;
            getMyOrderGroupFn(userId,grpId,function (err, orderGrps) {
                var allOrders   =   orderGrps[0].orders;
                var orderLength =   allOrders.length;
                var sameOrderCount  =   0;
                var isSame  =   false;

                var async   =   require('async');
                async.eachSeries(allOrders,function (eachOrder, finish) {
                    if(eachOrder.orderStatus == orderStatus){
                        sameOrderCount++;
                    }
                    finish();
                },function (done) {
                    if(orderLength == sameOrderCount){
                        //Update group
                        productManager.changeOrderGroupStatus(grpId,userId,orderStatus,function (err, stats) {

                            getMyOrderGroupFn(userId,grpId,function (err, orderGrps) {
                                if(orderStatus == "SHIPPED"){
                                    fetchAndPlaceOrderInShipRocket(orderGrps[0]);
                                }
                                callback(err, orderGrps);
                            });
                        })
                    }else {
                        callback(err, orderGrps);
                    }
                })

            });
        }
    })
};

function fetchAndPlaceOrderInShipRocket(orderGroups) {

    shippingQueue.add({orderInfo:orderGroups});

}

function buildShipRocketOrderObject(orderInfo,address,userId) {
    var shipOrderObj    =   {};
    var orders          =   orderInfo.orders;
    var shipOrderArr    =   [];
    var subTotal        =   orderInfo.totalAmount;
    var discount        =   0;
    if(orderInfo.discountedAmount != null && orderInfo.discountedAmount != undefined){
        var disc    =   parseFloat(orderInfo.discountedAmount);
        discount    =   subTotal-disc;
    }

    shipOrderObj.order_id               =   orderInfo.orderGroupId;
    shipOrderObj.order_date             =   orderInfo.orderedOn;
    shipOrderObj.channel_id             =   34317;
    shipOrderObj.billing_customer_name  =   address.firstName;
    shipOrderObj.billing_last_name      =   address.lastName;
    shipOrderObj.billing_address        =   address.address;
    shipOrderObj.billing_address_2      =   "";
    shipOrderObj.billing_city           =   address.city;
    shipOrderObj.billing_state          =   address.state;
    shipOrderObj.billing_country        =   "India";
    shipOrderObj.billing_pincode        =   address.pincode;
    shipOrderObj.billing_email          =   address.shipEmailId;
    shipOrderObj.billing_phone          =   address.shipMobileNumber;
    shipOrderObj.shipping_is_billing    =   1;
    shipOrderObj.shipping_customer_name =   "";
    shipOrderObj.shipping_last_name     =   "";
    shipOrderObj.shipping_address       =   "";
    shipOrderObj.shipping_address_2     =   "";
    shipOrderObj.shipping_city          =   "";
    shipOrderObj.shipping_country       =   "India";
    shipOrderObj.shipping_pincode       =   "";
    shipOrderObj.shipping_state         =   "";
    shipOrderObj.shipping_email         =   "";
    shipOrderObj.shipping_phone         =   "";
    shipOrderObj.payment_method         =   "COD";
    shipOrderObj.shipping_charges       =   0;
    shipOrderObj.giftwrap_charges       =   0;
    shipOrderObj.transaction_charges    =   0;
    shipOrderObj.total_discount         =   discount;
    shipOrderObj.sub_total              =   subTotal;
    shipOrderObj.length                 =   0;
    shipOrderObj.breadth                =   0;
    shipOrderObj.height                 =   0;
    shipOrderObj.weight                 =   30;
    var weight  =   0;
    for(var i=0;i<orders.length;i++){
        var eachOrder   =   orders[i];
        var shipOrder   =   {};

        shipOrderObj.length                 =   eachOrder.length;
        shipOrderObj.breadth                =   eachOrder.breadth;
        shipOrderObj.height                 =   eachOrder.height;

        shipOrder.name  =   eachOrder.productName;
        shipOrder.sku   =   "CLUBHOUSE"+eachOrder.pkProductId;
        shipOrder.tax   =   0;
        shipOrder.custom_field  =   "";
        shipOrder.units =   eachOrder.quantity;
        shipOrder.selling_price =   eachOrder.calculatedBasePrice
        shipOrder.discount  =   0;
        shipOrder.hsn   =   eachOrder.pkProductId;

        shipOrderArr.push(shipOrder);
    }

    shipOrderObj.order_items    =   shipOrderArr;

    console.log(shipOrderObj);
    return shipOrderObj;

}

exports.getAllPendingOrders = function (callback) {
    productManager.getAllPendingOrders(function (err, groups) {
        console.log(groups)
        if(!err && groups != undefined && groups.length > 0){
            var async = require('async');
            var ordersArr = [];
            async.eachSeries(groups,function (orderGroup, finish) {

                orderGroup.orders = [];
                //console.log(orderGroup);
                productManager.getAllOrdersFromGroupId(orderGroup.orderGroupId,function (err, orders) {
                    orderGroup.orders = orders;
                    ordersArr.push(orderGroup);
                    finish();
                })

            },function (done) {
                callback(err,ordersArr);
            })
        }else{
            callback(err,[]);
        }
    })
}

exports.getMyOrderGroup = function (userId, groupId, callback) {
    getMyOrderGroupFn(userId,groupId,function (err, grps) {
        callback(err,grps);
    })
};


function getMyOrderGroupFn(userId, groupId, callback) {
    productManager.getOrderGroupsWithGroupId(userId, groupId,function (err, groups) {
        //console.log(groups);
        if(!err && groups != undefined && groups.length > 0){
            var async = require('async');
            var ordersArr = [];
            async.eachSeries(groups,function (orderGroup, finish) {

                orderGroup.orders = [];
                //console.log(orderGroup);
                productManager.getAllOrdersFromGroup(userId,orderGroup.orderGroupId,function (err, orders) {
                    orderGroup.orders = orders;
                    ordersArr.push(orderGroup);
                    finish();
                })

            },function (done) {
                callback(err,ordersArr);
            })
        }else{
            callback(err,[]);
        }
    })
}
exports.getMyOrders = function (userId, callback) {
  productManager.getOrderGroups(userId,function (err, groups) {
      //console.log(groups);
      if(!err && groups != undefined && groups.length > 0){
          var async = require('async');
          var ordersArr = [];
          async.eachSeries(groups,function (orderGroup, finish) {

              orderGroup.orders = [];
              //console.log(orderGroup);
              productManager.getAllOrdersFromGroup(userId,orderGroup.orderGroupId,function (err, orders) {
                  orderGroup.orders = orders;
                  ordersArr.push(orderGroup);
                  finish();
              })

          },function (done) {
            callback(err,ordersArr);
          })
      }else{
          callback(err,[]);
      }
  })  
};
var getCart =   function (userId, callback) {
    productManager.getTotalCart(userId,function (err, status) {
        callback(err,status)
    })
}

var addingToCart    =   function (productData, callback) {
    productManager.addToCart(productData,function (err, product) {
        console.log(err)
        console.log(product)
        if(err || product == undefined || product.insertId == undefined){
            var productStat = {};
            productStat.productStat = err;
            callback(true,productStat);
        }else {
            var productStat = {};
            productStat.productStat = product;
            callback(false,productStat);
        }
    });
}

var addingToWishlist   =   function (wishlistInfo, callback) {
    productManager.isWishListExist(wishlistInfo.productId,wishlistInfo.userId,function (isExist, wish) {
        if(!isExist){
            productManager.addToWishlist(wishlistInfo.productId,wishlistInfo.userId,function (err, stat) {
                callback(err,stat);
            })
        }else{
            callback(true,"Product already exist in wishlist");
        }
    })
};

exports.removeCart  =   function (cartId,userId, callback) {
    productManager.removeCart(cartId,userId, function (err, stats) {
        callback(err, stats);
    })
};

exports.removeAllCart  =   function (userId, callback) {
    productManager.removeAllCart(userId,function (err, data) {
        callback(err,data)
    })
};


exports.addToOrderGroup = function (orderInfo, groupId, callback) {
    var orderGrpObj={
        fkUserId:orderInfo.pkUserId,
        orderGroupId:groupId,
        totalAmount:orderInfo.actualAmount
    };
    if(orderInfo.couponId){
        orderGrpObj.fkCouponId = orderInfo.couponId,
        orderGrpObj.discountedAmount = orderInfo.discountedAmount
    }
    productManager.addToOrderGroup(orderGrpObj, function (err, stats) {
        callback(err, stats);
    });
}

exports.addOrder = function (orderInfo, groupId, callback) {
    console.log("OrderInfo: ",orderInfo);
    var async = require('async');
    var isError = false;
    var errorObj=[];
    var result = [];
    async.eachSeries(orderInfo,function (order, finish) {
        var orderObj = {
            orderGroupId:groupId,
            fkUserId:order.pkUserId,
            fkProductId:order.fkProductId,
            fkMaterialId:order.fkMaterialId,
            fkColorId:order.fkColorId,
            height:order.height,
            length:order.length,
            breadth:order.breadth,
            quality:order.quality,
            quantity:order.quantity,
            calculatedBasePrice:order.calculatedPrice,
            calculatedTotalPrice:(parseFloat(order.calculatedPrice)*parseInt(order.quantity))
        };
        productManager.addOrder(orderObj,function (err, orderStat) {
            if(err){
                isError = true;
                errorObj.push(orderObj);
            }else{
                result.push(orderObj)
            }
            finish();
        })

    },function (done) {
        if(!isError){
            callback(false,result);
        }else{
            callback(true,errorObj);
        }
    })
}

exports.updateCart   =   function (productInfo, callback) {

    //tutorialManager.addExtraProductImages(productId,addedImages,function () {
        //tutorialManager.deleteProductImages(productId,deletedIds,function () {
            productManager.updateCart(productInfo, function (err, stats) {
                callback(err, stats);
            })
        //});
    //});
};

exports.deleteProduct   =   function (productId, callback) {
    productManager.deleteProduct(productId,function (err, stats) {
        callback(err,stats);
    })
};

exports.addToWishlist   =   function (wishData, callback) {
    addingToWishlist(wishData,function (err, wishInfo) {
        callback(err,wishInfo);
    })
};

exports.getMyWishlist   =   function (userId, callback) {
    productManager.getMyWishlist(userId,function (err, stats) {
        callback(err,stats);
    })
};

exports.removeFromWishlist  =   function (productId,userId, callback) {
    productManager.removeFromWishlist(productId,userId, function (err, stats) {
        callback(err, stats);
    })
}

exports.isWishListExist =   function (userId, productId, callback) {
    productManager.isWishListExist(productId,userId,function (isExist, wish) {
        callback(isExist,wish);
    });
};

exports.addUserProduct  =   function (userId, productInfo, callback) {
    productManager.addUserProduct(userId,productInfo,function (isExist, wish) {
        callback(isExist,wish);
    });
}