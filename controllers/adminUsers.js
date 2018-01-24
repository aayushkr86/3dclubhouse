
var express = require('express');
var router = express.Router();
var userManager =   require('../businessLayer/adminUserBA');
var cartManager = require('../businessLayer/userCartBA');
var categoryManager = require('../businessLayer/categoryBA');
var tutorialCategoryManager = require('../businessLayer/tutorialCategoryBA');
var postProManager = require('../businessLayer/postProBA');
var taxConfManager = require('../businessLayer/taxConfigBA');
var prniterConfManager = require('../businessLayer/printerConfBA');
var fixedSlicerManager = require('../businessLayer/fixedSlicerBA');
var packageConfManager = require('../businessLayer/packageConfBA');
var productManager  = require('../businessLayer/productBA');
var tutorialManager  = require('../businessLayer/tutorialBA');
var materialManager  = require('../businessLayer/materialBA');
var doodleManager  = require('../businessLayer/doodlePriceBA');
var colorManager  = require('../businessLayer/colorBA');
var adminManager  = require('../businessLayer/adminUserBA')
var studentManager  = require('../businessLayer/studentUserBA');
var config  =   require('../utils/config');
var loginValidator  = require('../utils/loginValidator')


module.exports = function(passport) {

  router.get('/products',loginValidator.isAdminLoggedIn,function (req, res) {
    res.render('main/productdetail.html',{loggedUserName:req.userName,loggedUserType:req.userType});
  });

  router.get('/login',function (req, res) {
    if(req.isAuthenticated() && req.user != undefined && req.user.isUser == undefined) {
        res.redirect('/admin/dashboard');
    }
    else if(req.user != undefined && req.user.isUser){
      res.redirect('/');
    }
    else
        res.render('admin/adminlogin.html')
  });

  router.get('/dashboard',loginValidator.isAdminLoggedIn,function (req, res) {
    console.log("Logged In ",req.userName);
    console.log({loggedUserName:req.userName,loggedUserType:req.userType});
    if(req.user.type != undefined){
      if(req.user.type == 0){
        res.render('admin/admindashboard.html',{loggedUserName:req.userName,loggedUserType:req.userType})
      }else if(req.user.type == 1){
        res.render('admin/designdashboard.html',{loggedUserName:req.userName,loggedUserType:req.userType})
      }
      else if(req.user.type == 2){
        res.render('admin/printdashboard.html',{loggedUserName:req.userName,loggedUserType:req.userType})
      }
      else if(req.user.type == 3){
        res.render('admin/shipdashboard.html',{loggedUserName:req.userName,loggedUserType:req.userType})
      }
      else if(req.user.type == 4){
        res.render('admin/accountingdashboard.html',{loggedUserName:req.userName,loggedUserType:req.userType})
      }
    }
  });
  router.get('/adminusers',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      res.render('admin/adminusers.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

    router.get('/admincustomers',loginValidator.isAdminLoggedIn,function (req, res) {
        studentManager.getAllStudentUsers(function (err, sts) {
            if(sts != undefined) {
                sts = JSON.stringify(sts);
                res.render('admin/admincustomers.html', {loggedUserName: req.userName, loggedUserType: req.userType,students:sts});
            }
        })
    });

  router.get('/adminfaq',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      res.render('admin/adminfaq.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/coupons',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {

      var couponObj = {
        pkCouponId: "",
        couponCode: "",minimumProductPrice:"",reductionAmount:"",reductionInPercent:"",
        maxReductionAmount:"",
        pincodeStart: "",
        pincodeEnd: "", startsOn: "", endsOn: "",
        status: 0,isEdit: false, loggedUserName: req.userName, loggedUserType: req.userType
      };
      if (req.query != undefined && req.query.id != undefined) {
        productManager.getCouponFromId(req.query.id,function (err, coupons) {
          if(!err && coupons != undefined && coupons.length > 0){
            var moment  = require('moment');
            var coupon  = coupons[0];
            coupon.isEdit=true;
            coupon.loggedUserName=req.userName;
            coupon.loggedUserType=req.userType;
            coupon.startsOn = moment(coupon.startsOn).format('YYYY-MM-DD');
            coupon.endsOn = moment(coupon.endsOn).format('YYYY-MM-DD');
            res.render('admin/admincoupon.html', coupon);
          }else {
            res.render('admin/admincoupon.html', couponObj);
          }
        });
      }else{
        res.render('admin/admincoupon.html', couponObj)
      }
    }else{
      res.redirect('/admin/dashboard')
    }
  });
  
  router.get('/getalladmins',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      adminManager.getAllAdmins(function (err, admins) {
        req.response.sendSuccessResponse(req, admins);
      })
    }else{
      req.response.sendErrorResponse(req, "Unauthorised");
    }
  });

  router.post('/deleteadmin',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0 && req.body.pkAdminUserId) {
      adminManager.deleteAdmin(req.body.pkAdminUserId,function (err, admins) {
        req.response.sendSuccessResponse(req, admins);
      })
    }else{
      req.response.sendErrorResponse(req, "Unauthorised");
    }
  })
  
  router.post('/addadmin',loginValidator.isAdminLoggedIn,function (req, res) {
    var info= req.body;
    if(info.name && info.emailId && info.password && info.type != undefined) {
      adminManager.addAdmin(req.body, function (err, status) {
        if (!err) {
          req.response.sendSuccessResponse(req, status);
        } else {
          req.response.sendErrorResponse(req, status,[err]);
        }
      })
    }else{
      req.response.sendErrorResponse(req, "Invalid Payload");
    }
  });
  router.get('/adminlockscreen',loginValidator.isAdminLoggedIn,function (req, res) {
    res.render('admin/adminlockscreen.html',{loggedUserName:req.userName,loggedUserType:req.userType})
  });

  router.get('/adminproducts',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0 || req.user.type == 1) {
      var productObj = {
        pkProductId: "",
        fkCategoryId: "", productName: "",
        productDesc: "", minHeight: 0, minLength: 0,
        minBreadth: 0, minPrice: 0, isProductBlocked: "",
        productImages: JSON.stringify([]),printTime:'',filamentLength:'',min_coefficient:'',max_coefficient:'',
        strength:'',fk_variable_code:'',fk_pp_id:'',
        categoryName: "", isEdit: false, loggedUserName: req.userName, loggedUserType: req.userType
      };

      if (req.query != undefined && req.query.id != undefined) {
        var productId = req.query.id;
        console.log(productId)
        productManager.getProductsFromId(productId,-1, function (err, product, images, isExist) {
          console.log("Pro: ", product)
          if (!err && product != undefined && product.length > 0) {
            var product = product[0];
            product.images = images;
            product.isEdit = true;
            productObj = {
              pkProductId: product.pkProductId,
              fkCategoryId: product.fkCategoryId,
              productName: product.productName,
              productDesc: product.productDesc,
              minHeight: product.minHeight,
              minLength: product.minLength,
              minBreadth: product.minBreadth,
              minPrice: product.minPrice,
              isProductBlocked: product.isProductBlocked,
              productImages: JSON.stringify(images),
              categoryName: product.categoryName,
              isEdit: true,
              loggedUserName: req.userName,
              loggedUserType: req.userType,
                printTime:product.printTime,
                filamentLength:product.filamentLength,
                coefficient:product.coefficient,
                strength:product.strength,
                variableCode:product.variableCode
            };

            res.render('admin/adminproducts.html', productObj)
          } else {
            res.render('admin/adminproducts.html', productObj)
          }
        })

      } else {
        res.render('admin/adminproducts.html', productObj)
      }
    }else{
      res.redirect('/admin/dashboard');
    }
  });

  router.get('/admintable',loginValidator.isAdminLoggedIn,function (req, res) {
    res.render('admin/admintable.html',{loggedUserName:req.userName,loggedUserType:req.userType})
  });

  router.get('/admincategories',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      var catObj = {
        pkCategoryId: "",
        categoryName: "",
        categoryDesc: "",
        categoryUnique: "",
        categoryImage: "",
        isEdit: false,
        loggedUserName: req.userName,
        loggedUserType: req.userType
      };
      console.log(req.query);
      if (req.query != undefined && req.query.cat != undefined) {
        var catId = req.query.cat;
        categoryManager.getAllCategoriesFromId(catId, function (err, category) {
          console.log(err);
          console.log(category)

          if (!err && category != undefined && category.length > 0) {
            var category = category[0];
            catObj.pkCategoryId = category.pkCategoryId;
            catObj.categoryName = category.categoryName;
            catObj.categoryDesc = category.categoryDesc;
            catObj.categoryUnique = category.categoryUnique;
            catObj.categoryImage = category.categoryImage;
            catObj.isEdit = true;
            catObj.loggedUserName = req.userName;
            catObj.loggedUserType = req.userType;

            res.render('admin/admincategories.html', catObj)
          } else {
            res.render('admin/admincategories.html', catObj)
          }
        })
      } else {
        res.render('admin/admincategories.html', catObj)
      }
    }else{
      res.redirect('/admin/dashboard')
    }
  });



  router.post('/auth/login',function (req, res, next) {
    passport.authenticate('local-login',function (err, user, status) {

      console.log(user)
      console.log(err)
      if(user != null && !err && status == true){

        req.logIn(user, function(err) {
          //req.response.sendSuccessResponse(req,user);
          res.redirect('/admin/dashboard');
        });

      }else{
        //req.response.sendErrorResponse(req,user,[err]);
        res.redirect('/admin/login?err=2');
      }

    })(req, res, next);

  });

  router.get('/getloggedinuser',function (req, res) {
    if(req.user && req.user.isUser == undefined){
      req.response.sendSuccessResponse(req,req.user);
    }else{
      req.response.sendErrorResponse(req,"No User Information");
    }
  });

  router.get('/signout',function (req, res) {
    req.logOut();
    res.redirect('/admin/login')
  });


  /*
  Designer Panels
   */
  router.get('/designorders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 1) {
      res.render('admin/designorders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  /*
  Print Panel
   */

  router.get('/printorders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 2) {
      res.render('admin/printorders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/printdesignorders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 2) {
      res.render('admin/printdesignorders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/shipdesignorders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 3) {
      res.render('admin/shipdesignorders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/shiporders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 3) {
      res.render('admin/shiporders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/accountingdesignorders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 4) {
      res.render('admin/accountingdesignorders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/accountingorders',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 4) {
      res.render('admin/accountingorders.html', {loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/adminmaterialcost',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      res.render('admin/adminmaterialcost.html',{loggedUserName: req.userName, loggedUserType: req.userType})
    }else{
      res.redirect('/admin/dashboard')
    }
  })
  router.get('/adminmaterials',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      var catObj = {
        pkMaterialId: "",
        materialName: "",
        isEdit: false,
          materialDesc:"",
          materialCost:"",
          materialWeight:"",
          colors:"[]",
        loggedUserName: req.userName,
        loggedUserType: req.userType
      };
      console.log(req.query);
      if (req.query != undefined && req.query.mat != undefined) {
        var catId = req.query.mat;
        materialManager.getMaterialsFromId(catId, function (err, materials) {
          console.log(err);
          console.log(materials)

          if (!err && materials != undefined && materials.length > 0) {
            var category = materials[0];
            catObj.pkMaterialId = category.pkMaterialId;
            catObj.materialName = category.materialName;
            catObj.materialDesc = category.materialDesc;
            catObj.materialCost = category.materialCost;
            catObj.materialWeight = category.materialWeight;
            catObj.colors = JSON.stringify(category.colors);
            catObj.isEdit = true;
            catObj.loggedUserName = req.userName;
            catObj.loggedUserType = req.userType;

            res.render('admin/adminmaterials.html', catObj)
          } else {
            res.render('admin/adminmaterials.html', catObj)
          }
        })
      } else {
        res.render('admin/adminmaterials.html', catObj)
      }
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/admincolors',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0) {
      var catObj = {
        pkColorId: "",
        colorName: "",
          color_hex:"",
        isEdit: false,
        loggedUserName: req.userName,
        loggedUserType: req.userType
      };
      console.log(req.query);
      if (req.query != undefined && req.query.col != undefined) {
        var catId = req.query.col;
        colorManager.getColorFromId(catId, function (err, colors) {
          console.log(err);
          console.log(colors)

          if (!err && colors != undefined && colors.length > 0) {
            var category = colors[0];
            catObj.pkColorId = category.pkColorId;
            catObj.colorName = category.colorName;
            catObj.color_hex = category.color_hex;
            catObj.isEdit = true;
            catObj.loggedUserName = req.userName;
            catObj.loggedUserType = req.userType;

            res.render('admin/admincolors.html', catObj)
          } else {
            res.render('admin/admincolors.html', catObj)
          }
        })
      } else {
        res.render('admin/admincolors.html', catObj)
      }
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  // router.get('/admintutorials',loginValidator.isAdminLoggedIn,function (req, res) {
  //   res.render('admin/admintutorials.html')
  // });

  router.get('/admintutorials',loginValidator.isAdminLoggedIn,function (req, res) {
    if (req.user.type == 0 || req.user.type == 1) {
      var productObj = {
        pkTutorialId: "",
        fkTutorialCatId: "", tutorialTitle: "",
        tutorialDesc: "",isTutDeleted: "",
        tutorialResources: JSON.stringify([]),
        tutorialCategoryName: "", isEdit: false, loggedUserName: req.userName, loggedUserType: req.userType
      };

      if (req.query != undefined && req.query.id != undefined) {
        var productId = req.query.id;
        console.log(productId)
        tutorialManager.getTutorialFromId(productId, function (err, tutorial, resources) {
          console.log("Pro: ", tutorial)
          if (!err && tutorial != undefined && tutorial.length > 0) {
            var product = tutorial[0];
            product.resources = resources;
            product.isEdit = true;
            productObj = {
              pkTutorialId: product.pkTutorialId,
              fkTutorialCatId: product.fkTutorialCatId,
              tutorialTitle: product.tutorialTitle,
              tutorialDesc: product.tutorialDesc,
              isTutDeleted: product.isTutDeleted,
              tutorialResources: JSON.stringify(resources),
              tutorialCategoryName: product.tutorialCategoryName,
              isEdit: true,
              loggedUserName: req.userName,
              loggedUserType: req.userType
            };

            res.render('admin/admintutorials.html', productObj)
          } else {
            res.render('admin/admintutorials.html', productObj)
          }
        })

      } else {
        res.render('admin/admintutorials.html', productObj)
      }
    }else{
      res.redirect('/admin/dashboard');
    }
  });

  router.get('/admintutorialcategories',loginValidator.isAdminLoggedIn,function (req, res) {
    //res.render('admin/admintutcategories.html');
    console.log("TUT CAT")
    if (req.user.type == 0) {
      var tutCatObj = {
        pkTutorialCatId: "",
        tutorialCategoryName: "",
        tutorialLevel: "",
        tutorialCatImage: "",
        isEdit: false,
        loggedUserName: req.userName,
        loggedUserType: req.userType
      };
      console.log(req.query);
      if (req.query != undefined && req.query.cat != undefined) {
        var catId = req.query.cat;
        tutorialCategoryManager.getAllCategoriesFromId(catId, function (err, category) {
          console.log(err);
          console.log(category)

          if (!err && category != undefined && category.length > 0) {
            var category = category[0];
            tutCatObj.pkTutorialCatId = category.pkTutorialCatId;
            tutCatObj.tutorialCategoryName = category.tutorialCategoryName;
            tutCatObj.tutorialLevel = category.tutorialLevel;
            tutCatObj.tutorialCatImage = category.tutorialCatImage;
            tutCatObj.isEdit = true;
            tutCatObj.loggedUserName = req.userName;
            tutCatObj.loggedUserType = req.userType;

            res.render('admin/admintutcategories.html', tutCatObj)
          } else {
            res.render('admin/admintutcategories.html', tutCatObj)
          }
        })
      } else {
        res.render('admin/admintutcategories.html', tutCatObj)
      }
    }else{
      res.redirect('/admin/dashboard')
    }
  });

  router.get('/getadmincounts',loginValidator.isAdminLoggedIn,function (req, res) {
    adminManager.getAllCounts(function (err, counts) {
      res.send(counts);
    })
  })


  router.get('/getallpendingorders',loginValidator.isAdminLoggedIn,function (req, res) {
    cartManager.getAllPendingOrders(function (err, orders) {
      res.send(orders);
    })
  });

  router.post('/changeorderstatus',loginValidator.isAdminLoggedIn,function (req, res) {
    var orderId = req.body.pkOrderId;
    var stat    = req.body.orderStatus;
    cartManager.changeOrderStatus(orderId,stat,function (err, ordrGrps) {
      res.send(ordrGrps);
    })
  });

  router.get('/homeimages',loginValidator.isAdminLoggedIn,function (req, res) {
      var homeObj = {
          loggedUserName: req.userName,
          loggedUserType: req.userType
      };
      res.render('admin/adminhomeimages.html',homeObj)
  });

    router.get('/landingimages',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType
        };
        res.render('admin/adminlandingimages.html',homeObj)
    });

    router.get('/adminpostprocess',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType,
            pk_post_process_id:"",
            fk_material_id:"",
            materialName:"",
            process_name:"",
            availability:"",
            cost_percentage:"",
            discount_percentage:"",
            final_cost_percentage:"",
            isEdit:false
        };

        if (req.query != undefined && req.query.id != undefined) {
            var processId = req.query.id;
            console.log(processId);
            postProManager.getPostProFromId(processId,function (err,postPro) {

                if(!err && postPro != undefined && postPro.length > 0) {
                    postPro = postPro[0];
                    postPro.loggedUserName = homeObj.loggedUserName;
                    postPro.loggedUserType = homeObj.loggedUserType;
                    postPro.isEdit = true;
                    res.render('admin/adminpp.html', postPro)
                }else{
                    res.render('admin/adminpp.html', homeObj)
                }
            })
        }else {
            res.render('admin/adminpp.html', homeObj)
        }
    });


    router.get('/admindoodleprices',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType,
            pk_doodle_price_id:"",
            price:"",
            isEdit:false
        };

        if (req.query != undefined && req.query.id != undefined) {
            var processId = req.query.id;
            console.log(processId);
            doodleManager.getDoodlePriceFromId(processId,function (err,postPro) {

                if(!err && postPro != undefined && postPro.length > 0) {
                    postPro = postPro[0];
                    postPro.loggedUserName = homeObj.loggedUserName;
                    postPro.loggedUserType = homeObj.loggedUserType;
                    postPro.isEdit = true;
                    res.render('admin/admindoodleprices.html', postPro)
                }else{
                    res.render('admin/admindoodleprices.html', homeObj)
                }
            })
        }else {
            res.render('admin/admindoodleprices.html', homeObj)
        }
    });

    router.get('/admintaxconfig',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType,
            pk_taxconf_id:"",
            markup_1:"",
            markup_2:"",
            gst_print:"",
            shipping:"",
            discount_print:"",
            isEdit:false
        };

        // if (req.query != undefined && req.query.id != undefined) {
        //     var processId = req.query.id;
        //     console.log(processId);
            taxConfManager.getAllTaxConf(function (err,postPro) {

                if(!err && postPro != undefined && postPro.length > 0) {
                    postPro = postPro[0];
                    postPro.loggedUserName = homeObj.loggedUserName;
                    postPro.loggedUserType = homeObj.loggedUserType;
                    postPro.isEdit = true;
                    res.render('admin/admintaxconf.html', postPro)
                }else{
                    res.render('admin/admintaxconf.html', homeObj)
                }
            })
        // }else {
        //     res.render('admin/admintaxconf.html', homeObj)
        // }
    });

    router.get('/adminprinterconf',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType,
            pk_printer_dim_id:"",
            printer_code:"",
            min_dimension:"",
            max_dimension:"",
            printer_rate:"",
            isEdit:false
        };

        if (req.query != undefined && req.query.id != undefined) {
            var processId = req.query.id;
            console.log(processId);
            prniterConfManager.getPrinterConfFromId(processId,function (err,postPro) {

                if(!err && postPro != undefined && postPro.length > 0) {
                    postPro = postPro[0];
                    postPro.loggedUserName = homeObj.loggedUserName;
                    postPro.loggedUserType = homeObj.loggedUserType;
                    postPro.isEdit = true;
                    res.render('admin/adminprintconf.html', postPro)
                }else{
                    res.render('admin/adminprintconf.html', homeObj)
                }
            })
        }else {
            res.render('admin/adminprintconf.html', homeObj)
        }
    });

    router.get('/adminpackageconf',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType,
            pk_package_conf_id:"",
            min_length:"",
            max_length:"",
            min_breadth:"",
            max_breadth:"",
            min_height:"",
            max_height:"",
            package_cost:"",
            isEdit:false
        };

        if (req.query != undefined && req.query.id != undefined) {
            var processId = req.query.id;
            console.log(processId);
            packageConfManager.getPackageConfFromId(processId,function (err,postPro) {

                if(!err && postPro != undefined && postPro.length > 0) {
                    postPro = postPro[0];
                    postPro.loggedUserName = homeObj.loggedUserName;
                    postPro.loggedUserType = homeObj.loggedUserType;
                    postPro.isEdit = true;
                    res.render('admin/adminpackageconf.html', postPro)
                }else{
                    res.render('admin/adminpackageconf.html', homeObj)
                }
            })
        }else {
            res.render('admin/adminpackageconf.html', homeObj)
        }
    });

    router.get('/adminfixedslicer',loginValidator.isAdminLoggedIn,function (req, res) {
        var homeObj = {
            loggedUserName: req.userName,
            loggedUserType: req.userType,
            pk_fixed_id:"",
            quality:"",
            strength:"",
            variable_code:"",
            isEdit:false
        };

        if (req.query != undefined && req.query.id != undefined) {
            var processId = req.query.id;
            console.log(processId);
            fixedSlicerManager.getFixedSlicerFromId(processId,function (err,postPro) {

                if(!err && postPro != undefined && postPro.length > 0) {
                    postPro = postPro[0];
                    postPro.loggedUserName = homeObj.loggedUserName;
                    postPro.loggedUserType = homeObj.loggedUserType;
                    postPro.isEdit = true;
                    res.render('admin/adminfixedslicer.html', postPro)
                }else{
                    res.render('admin/adminfixedslicer.html', homeObj)
                }
            })
        }else {
            res.render('admin/adminfixedslicer.html', homeObj)
        }
    });



    return router;
}

