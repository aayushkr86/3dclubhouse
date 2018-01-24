var express = require('express');
var router = express.Router();
var loginValidator  = require('../utils/loginValidator')
var studentManager  = require('../businessLayer/studentUserBA');
var productManager  = require('../businessLayer/productBA');
var categoryManager = require('../businessLayer/categoryBA');
var cartManager =   require('../businessLayer/userCartBA');
var host  = ""
var redis = require('redis'),
    redisClient = redis.createClient();

if(process.env.RUNNING_HOST == 0){
    host  = "http://localhost:3000/"
}else{
    host  = "http://34.202.5.62/"
}
module.exports = function(passport) {
    /* GET users listing. */
    router.get('/',loginValidator.isUseLoggedIn, function (req, res, next) {
        res.render('main/home.html');
    });

    router.get('/login', function (req, res, next) {
        if(req.isAuthenticated() && req.user != undefined && req.user.isUser){
            res.redirect('/')
        }else {
            res.render('main/landing.html');
        }
    });

    router.get('/account/login', function (req, res, next) {
        if(req.isAuthenticated() && req.user != undefined && req.user.isUser){
            res.redirect('/')
        }else {
            res.render('main/login.html');
        }
    });

    router.post('/twofactor',function (req, res) {
        var id  = req.query.auth;
        var otpEntered  = req.body.student_otp;
        if(id != null && id != undefined && otpEntered != "") {
            var atob  = require('atob')
            var decodedString = atob(id);
            console.log("DECODED: ",decodedString);
            redisClient.get(decodedString,function (err, data) {
                console.log("From_REDIS:",data);
                console.log(err);
                if(!err && data != "" && data != null) {
                    data  = JSON.parse(data);
                    console.log("PARSED_REDIS:",data);
                    if(data.otp != otpEntered){

                        console.log("Wrong OTP")
                        res.redirect('/twofactor?auth='+id+"&errcode=10003");
                    }else{
                        var userId  = data.userId;
                        if(userId == undefined || userId == null || userId == ""){
                            userId  = data.pkUserId;
                        }
                        studentManager.updateUser({isOTPVerified:1},userId,function (err, st) {
                            if(st.isRegPaid == undefined || st.isRegPaid == 0) {
                                paytm(data, function (order) {
                                    res.render('main/pgredirect.html', {'restdata': order});
                                })
                            }else{
                                res.redirect('/');
                            }
                        });

                    }

                }else{
                    res.redirect('/twofactor?auth='+id+"&errcode=10004");
                    //res.redirect('/account/login')
                }
            })

        }else{
            res.redirect('/twofactor?auth='+id+"&errcode=10005");
        }
    });

    router.get('/twofactor',function (req, res) {
        var id  = req.query.auth;
        if(id != null && id != undefined) {
            var atob  = require('atob')
            var decodedString = atob(id);
            console.log("DECODED: ",decodedString);
            redisClient.get(decodedString,function (err, data) {
                if(!err && data != "" && data != null) {
                    res.render('main/otp.html')
                }else{
                    res.redirect('/account/login')
                }
            })

        }else{
            res.redirect('/account/login')
        }
    })

    router.post('/account/login/form', function (req, res, next) {
        //var redirectTo = req.body.redirectTo;
        console.log("hit")
        passport.authenticate('user-login', function (err, user, status) {
            console.log("Passport")
            console.log(user)
            console.log(err)
            console.log(status);
            if (user != null && !err && status == true) {
                console.log("login----");

                if(user.isOTPVerified == undefined || user.isOTPVerified == 0){
                    var otpManager  = require('../businessLayer/OTPManager');
                    otpManager.navigateToOTP(user,function (userInfo, encoder) {
                        res.redirect('/twofactor?auth='+encoder);
                    })
                } else if(user.isRegPaid == 0){
                    // var otpManager  = require('../businessLayer/OTPManager');
                    // otpManager.navigateToOTP(user,function (userInfo, encoder) {
                    //res.redirect('/twofactor?auth='+encoder);
                    // })
                    //res.redirect('/registration?auth='+encoder);

                    paytm(user,function (orderDetail) {
                        res.redirect('/pay?id='+JSON.stringify(orderDetail))
                        //res.render('main/pgredirect.html',{ 'restdata' : orderDetail });
                    });
                }
                else {
                    req.logIn(user, function (err) {
                        //req.response.sendSuccessResponse(req,user);
                        res.redirect('/');
                    });
                }

            } else {
                //req.response.sendErrorResponse(req,user,[err]);
                res.redirect('/');
            }

        })(req, res, next);

    });

    router.get('/pay',function (req, res) {
        var id=req.query.id;
        console.log("PAY",id);
        if(id != undefined){
            id = JSON.parse(id);
            res.render('main/pgredirect.html',{ 'restdata' : id });
        }
    })
    router.get('/user/getloggedinuser', function (req, res) {
        console.log("Req.User : ",req.user)
        if (req.user && req.user.isUser) {
            req.response.sendSuccessResponse(req, req.user);
        } else {
            req.response.sendErrorResponse(req, "No User Information");
        }
    });

    router.get('/user/signout',function (req, res) {
        if(req.user && req.user.isUser) {
            req.logOut();
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    });

    function genRand() {
        return Math.floor(Math.random()*89999+10000);
    }
    router.post('/account/login',function(req,res){
        console.log(req.body)
        if(req.body.name && req.body.name != "" && req.body.emailId != undefined && req.body.emailId != "") {
            studentManager.addStudentUser(req.body, function (err, stat) {
                if (!err && stat != undefined && stat.insertId != undefined) {
                    req.body.pkUserId = stat.insertId;

                    var otpManager = require('../businessLayer/OTPManager');
                    req.body.isOTPVerified = 0;
                    otpManager.navigateToOTP(req.body,function (userInfo, encodedRedirectId) {
                        res.redirect('/twofactor?auth='+encodedRedirectId);
                    })



                    // paytm(req.body, function (order) {
                    //   res.render('main/pgredirect.html', {'restdata': order});
                    // })
                    //req.response.sendSuccessResponse(req, stat);
                } else {
                    req.response.sendErrorResponse(req, stat, [err]);
                }
            })
        }else{
            req.response.sendErrorResponse(req, "Invalid Param");
        }
    });

    // router.get('/register',function(req,res){
    //   res.render('main/register.html')
    // });

    router.post('/registration/payment/callback',function (req, res) {
        console.log("REDIRECTED FROM PAYTM");
        console.log("in response post");
        var paramlist = req.body;
        var paramarray = new Array();
        console.log(paramlist);
        var paytm_config = require('../paytm/paytm_config').paytm_config_1;
        var checksum = require('../paytm/checksum');
        if(checksum.verifychecksum(paramlist, paytm_config.MERCHANT_KEY))
        {

            console.log("true");
            res.render('response.html',{ 'restdata' : "true" ,'paramlist' : paramlist});
        }else
        {
            console.log("false");
            res.render('response.html',{ 'restdata' : "false" , 'paramlist' : paramlist});
        };
    });
    router.post('/registration/payment',function (req, res) {

        if(req.user && req.user.isRegPaid != undefined && req.user.isRegPaid == 0){
            paytm(req.user,function (orderDetail) {

                res.render('main/pgredirect.html',{ 'restdata' : orderDetail });
            });
        }else{
            res.redirect('/');
        }
    });



    function paytm(data,callback) {
        var userId  = data.pkUserId;
        console.log("paytm")
        console.log(host);
        var paytm_checksum = require('../paytm/checksum');
        var paytm_config = require('../paytm/paytm_config').paytm_config_1;
        console.log(paytm_config)
        var paramarray = {};
        paramarray['MID'] = paytm_config.MID; //Provided by Paytm
        paramarray['ORDER_ID'] = 'order_register_'+userId; //unique OrderId for every request
        paramarray['CUST_ID'] = 'customer_'+userId;  // unique customer identifier
        paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
        paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
        paramarray['TXN_AMOUNT'] = '2000.00'; // transaction amount
        paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
        paramarray['CALLBACK_URL'] = host+'registration/payment/callback'//'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp';//Provided by Paytm
        paramarray['EMAIL'] = data.emailId; // customer email id
        paramarray['MOBILE_NO'] = '9902099573'; // customer 10 digit mobile no.
        paramarray['REQUEST_TYPE'] = 'DEFAULT '; // customer 10 digit mobile no.
        console.log(paramarray)
        paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, res) {
            callback(res);
        });
    };

    router.post('/checkout/payment/callback',function (req, res) {
        console.log("REDIRECTED FROM PAYTM");
        console.log("in response post");
        var paramlist = req.body;
        var paramarray = new Array();
        console.log(paramlist);
        var paytm_config = require('../paytm/paytm_config').paytm_config_1;
        var checksum = require('../paytm/checksum');
        if(checksum.verifychecksum(paramlist, paytm_config.MERCHANT_KEY))
        {
            console.log("true");
            res.render('response.html',{ 'restdata' : "true" ,'paramlist' : paramlist});
        }else
        {
            console.log("false");
            res.render('response.html',{ 'restdata' : "false" , 'paramlist' : paramlist});
        };
    });

    router.post('/checkout',loginValidator.isUseLoggedIn,function (req, res) {
        console.log("PAYMENT ", req.body);
        var backupReq = req.user;
        var couponCode = req.body.couponCode;
        var pin = req.body.pincode;
        var content = req.body;
        delete content["couponCode"];
        var orderGroupId  = new Date().getTime();
        console.log("GROUPID: ",orderGroupId)
        studentManager.addBillingUserAddress(content,req.userId,function (err, addrStat) {

            cartManager.getTotalCart(req.userId, function (err, cartInfo) {
                req.user.order = cartInfo;
                var totalPrice = 0;
                for (var i = 0; i < cartInfo.length; i++) {
                    console.log(cartInfo[i]);
                    console.log(parseInt(cartInfo[i].quantity))
                    console.log(parseInt(cartInfo[i].minPrice))
                    var multipliedPrice = parseInt(cartInfo[i].quantity) * parseInt(cartInfo[i].calculatedPrice)
                    totalPrice += multipliedPrice;
                }
                req.user.discountedAmount = totalPrice;
                req.user.actualAmount = totalPrice;
                var amountAfter = totalPrice;
                if(couponCode != undefined && couponCode != ""){
                    productManager.getCouponFromName(couponCode,req.userId,function (err, couponIfnfo) {
                        if(!err && couponIfnfo != undefined && couponIfnfo.length > 0) {
                            couponIfnfo = couponIfnfo[0];
                            console.log("CouponInfo: ", couponIfnfo);
                            pin = parseInt(pin);
                            console.log("PIN: ", pin);
                            console.log("PINSTRAT: ", couponIfnfo.pincodeStart);
                            console.log("PINEND: ", couponIfnfo.pincodeEnd);
                            if (pin >= parseInt(couponIfnfo.pincodeStart) && pin <= parseInt(couponIfnfo.pincodeEnd)) {
                                var total = totalPrice;
                                total = parseFloat(total);
                                if (total >= couponIfnfo.minimumProductPrice) {

                                    if (couponIfnfo.reductionAmount != 0) {
                                        req.user.couponId = couponIfnfo.pkCouponId;
                                        amountAfter = total - parseFloat(couponIfnfo.reductionAmount);
                                    } else if (couponIfnfo.reductionInPercent != 0) {
                                        req.user.couponId = couponIfnfo.pkCouponId;
                                        var percentGrant = (parseFloat(couponIfnfo.reductionInPercent) / 100) * total;
                                        amountAfter = total - percentGrant;
                                    }
                                } else {
                                    console.log("couponIfnfo.minimumProductPrice")
                                }
                            } else {
                                console.log("NOt for this pin")
                            }
                            req.user.discountedAmount = amountAfter;
                            console.log("FOR PAYMENT: ", req.user);
                            placeOrder(req.user, orderGroupId, function (err,status) {
                                req.user = backupReq
                                //placeOrderInShipRocket(req.userId,orderGroupId);
                                res.redirect('/myaccount-orders')
                            })
                        }else{
                            req.user.discountedAmount = amountAfter;
                            console.log("FOR PAYMENT: ", req.user);
                            placeOrder(req.user,orderGroupId,function (err,status) {
                                req.user = backupReq
                                //placeOrderInShipRocket(req.userId,orderGroupId);
                                res.redirect('/myaccount-orders')
                            })
                        }

                    });
                }else{
                    req.user.discountedAmount = amountAfter;
                    console.log("FOR PAYMENT: ", req.user);
                    placeOrder(req.user,orderGroupId,function (err,status) {
                        req.user = backupReq
                        //placeOrderInShipRocket(req.userId,orderGroupId);
                        res.redirect('/myaccount-orders')
                    })

                }

                // paytm(req.user, function (order) {
                //   res.render('main/pgredirect.html', {'restdata': order});
                // })

            });
        });
        // req.user.pkUserId=1;
        // req.user.mobileNumber='9902099675';
        // req.user.emailId='aooj@gmail.com';
        // paytm(req.user, function (order) {
        //        res.render('main/pgredirect.html', {'restdata': order});
        // })
    });

    function placeOrderInShipRocket(userId,groupId) {
        cartManager.getMyOrderGroup(userId,groupId,function (err, orders) {
            studentManager.getBillingAddress(userId,function (err, address) {
                var shipRocketManager = require('../dataAccessLayer/shipRocketManager');
                shipRocketManager.placeOrder(orders)
            })
        })
    }
    function placeOrder(orderInfo, groupId, callback) {
        console.log("PLACE: ",orderInfo);
        var cartInfo      = orderInfo.order;
        cartInfo.fkUserId = orderInfo.pkUserId;
        cartManager.addOrder(cartInfo,groupId,function (err, stat) {
            if(!err){
                cartManager.addToOrderGroup(orderInfo,groupId,function (err, grpStat) {
                    cartManager.removeAllCart(orderInfo.pkUserId,function (err, removeData) {
                        callback(err,grpStat);
                    });
                })
            }else{
                callback(false,stat);
            }

        })
    }

    function paytmCheckout(data,callback) {
        var userId  = data.pkUserId;
        console.log("paytm")
        console.log(host);
        var paytm_checksum = require('../paytm/checksum');
        var paytm_config = require('../paytm/paytm_config').paytm_config_1;
        console.log(paytm_config)
        var paramarray = {};
        paramarray['MID'] = paytm_config.MID; //Provided by Paytm
        paramarray['ORDER_ID'] = 'order_register_13'+userId; //unique OrderId for every request
        paramarray['CUST_ID'] = data.pkUserId;  // unique customer identifier
        paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
        paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
        paramarray['TXN_AMOUNT'] = ""+data.totalAmount; // transaction amount
        paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
        paramarray['CALLBACK_URL'] = host+'/cart/checkout/payment/callback'//'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp';//Provided by Paytm
        paramarray['EMAIL'] = data.emailId; // customer email id
        paramarray['MOBILE_NO'] = data.mobilenumber; // customer 10 digit mobile no.
        paramarray['REQUEST_TYPE'] = 'DEFAULT '; // customer 10 digit mobile no.
        console.log(paramarray)
        paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, res) {
            callback(res);
        });
    };




    router.get('/shop',loginValidator.isUseLoggedIn,function (req, res) {
        var catId  = req.query.category;
        var visibility=req.query.viewtype;
        console.log("CAT: ",catId);
        console.log("USERL ",req.userId);
        var obj = {isSideCat:false,products:"[]"};
        if(catId != "all" && catId != undefined) {
            var catData = {pkCategoryId: catId};
            categoryManager.isCategoryExist(catData, function (isExist, data) {
                if (isExist) {
                    var page  = 1;
                    if(req.query.page != undefined){
                        page  = req.query.page;
                    }
                    var search=null;
                    if(req.query.search != undefined){
                        search  = req.query.search;
                    }
                    categoryManager.getProductsOfCategory(catId,req.userId,page,search,function (err,products) {
                        var stat  = {products:JSON.stringify(products),categoryname:JSON.stringify(data[0])};
                        shopResponse(res,stat,visibility)
                    })

                } else {
                    console.log("CATEGORY: ",catId);
                    res.redirect('/')
                }
            });
        }else if(catId == "all"){
            obj.isSideCat = true;
            shopResponse(res,obj,visibility)
        }
        else{
            res.redirect('/')
        }
    });

    function shopResponse(res, obj, visibility) {
        if(visibility == "grid"){
            res.render('main/shop-grid.html',obj);
        }else if(visibility == "list"){
            res.render('main/shop-list.html',obj);
        }else{
            res.render('main/shop-grid.html',obj);
        }
    }

    router.get('getproductsfromcat',loginValidator.isUseLoggedIn,function (req, res) {
        var catId  = req.query.category;
        var visibility=req.query.viewtype;
        if(catId != "all" && catId != undefined) {
            categoryManager.isCategoryExist(catData, function (isExist) {
                if (isExist) {
                    var page = 1;
                    if (req.query.page != undefined) {
                        page = req.query.page;
                    }
                    var search  = null;
                    if(req.query.search != undefined){
                        search  = req.query.search;
                    }
                    categoryManager.getProductsOfCategory(catId, page, search, function (err, products) {
                        if (!err) {
                            req.response.sendSuccessResponse(req, products);
                        } else {
                            req.response.sendErrorResponse(req, err, [err]);
                        }
                    })
                } else {
                    req.response.sendErrorResponse(req, "Invalid Category");
                }
            });
        }else{

        }
    })
    router.get('/cart',loginValidator.isUseLoggedIn,function (req, res) {
        cartManager.getTotalCart(req.userId,function (err, cart) {
            if(cart.length > 0) {
                cart  = JSON.stringify(cart);
                var _cart={
                    cartInfo:cart
                }
                res.render('main/cart.html',_cart);
            }else{
                res.render('main/cart_empty.html')
            }
        });
    });
    router.get('/cart_empty',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/cart_empty.html')
    });

    router.get('/wishlist',loginValidator.isUseLoggedIn,function (req, res) {
        cartManager.getMyWishlist(req.userId,function (err, wishes) {
            console.log(wishes);
            if(wishes.length > 0) {
                wishes = JSON.stringify(wishes);
                var _wish = {
                    wishInfo: wishes
                }
                res.render('main/wishlist.html', _wish)
            }else{
                res.render('main/wishlist_empty.html')
            }
        });
    });
    router.get('/wishlist_empty',function (req, res) {
        res.render('main/wishlist_empty.html')
    });

    router.get('/faq',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/faq.html')
    });

    router.get('/tutorials',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/tutorials.html')
    });

    router.get('/tutorials/detail',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/tutorial-detail.html')
    });

    router.get('/myaccount-password',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/myaccount-password.html')
    });

    router.get('/myaccount-orders',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/myorders.html')
    });

    router.get('/designupload',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/design-upload.html');
    });

    router.get('/designupload/doodle',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/design-upload-doodle.html');
    });


    router.get('/product',loginValidator.isUseLoggedIn,function(req,res){
        if (req.query != undefined && req.query.id != undefined) {
            var id  = req.query.id;
            var userId  = req.userId;
            productManager.getProductsFromId(id,userId,function (err, productInfo,images,isWished) {
                if(!err &&productInfo!=undefined && productInfo.length >0) {
                    images  = JSON.stringify(images)
                    productInfo = productInfo[0];
                    productInfo.images=(images);
                    productInfo.isWished  = isWished;
                    productInfo.baseMaterial  = JSON.stringify(productInfo.baseMaterial)
                    console.log("PRODUCTINFO: ", productInfo);
                    res.render('main/product.html',productInfo)
                }else{
                    res.redirect('/');
                }
            });
        }
    });

    router.post('/updateuserinfo',loginValidator.isUseLoggedIn,function (req, res) {
        studentManager.updateUser(req.body,req.user.pkUserId,function (err, user) {
            if (!err) {
                req.login(user, function(err) {
                    if (err) return next(err)
                })
                req.response.sendSuccessResponse(req, user);
            } else {
                req.response.sendErrorResponse(req,err, [err]);
            }
        })
    });

    router.post('/addbillinguseraddress',loginValidator.isUseLoggedIn,function (req, res) {
        studentManager.addBillingUserAddress(req.body,req.user.pkUserId,function (err, user) {
            if (!err) {
                req.response.sendSuccessResponse(req, user);
            } else {
                req.response.sendErrorResponse(req,err, [err]);
            }
        })
    });

    router.post('/addshippinguseraddress',loginValidator.isUseLoggedIn,function (req, res) {
        console.log(req.body)
        studentManager.addShippingUserAddress(req.body,req.user.pkUserId,function (err, user) {
            if (!err) {
                req.response.sendSuccessResponse(req, user);
            } else {
                req.response.sendErrorResponse(req,err, [err]);
            }
        })
    })

    router.get('/myaccount-billing',loginValidator.isUseLoggedIn,function (req, res) {
        studentManager.getBillingAddress(req.userId,function (err, address) {
            res.render('main/myaccount-billing.html',address);
        });
    });

    router.get('/myaccount-shipping',loginValidator.isUseLoggedIn,function (req, res) {
        studentManager.getShippingAddress(req.userId,function (err, address) {
            res.render('main/myaccount-shipping.html',address)
        });
    });

    router.get('/checkout',loginValidator.isUseLoggedIn,function (req, res) {
        studentManager.getShippingAddress(req.userId,function (err, shipAddr) {
            if(shipAddr.pkAddressId != "") {
                studentManager.getBillingAddress(req.userId, function (err, address) {
                    cartManager.getTotalCart(req.userId, function (err, cart) {
                        if (cart.length > 0) {
                            res.render('main/checkout.html', address)
                        } else {
                            res.redirect('/');
                        }
                    });
                });
            }else{
                res.redirect('/myaccount-shipping')
            }
        });
    });

    router.get('/myaccount',loginValidator.isUseLoggedIn,function (req, res) {
        var user  = req.user;
        console.log(user);
        res.render('main/myaccount.html',user)
    });
    router.get('/myaccount-contact',loginValidator.isUseLoggedIn,function (req, res) {
        res.render('main/myaccount-contact.html',req.user)
    });



    return router;
}
