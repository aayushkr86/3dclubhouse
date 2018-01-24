/**
 * Created by anooj on 30/05/17.
 */

exports.isAdminLoggedIn  =   function(req, res, next) {
    if (req.isAuthenticated() && req.user != undefined && req.user.isUser == undefined) {
        console.log("isAuthenticated");
        console.log(req.user)
        console.log(req.user.type);
        req.userName    =   req.user.name;
        var type        =   "Administrator";

        if(req.user.type != undefined){
            var _type   =   req.user.type;
            //switch (res.user.type) {
                if(_type == 0) {
                    type    =   "Administrator";
                }
                else if(_type == 1){
                    type    =   "Design House Admin";
                }
                else if(_type == 2){
                    type    =   "Print House Admin";
                }
                else if(_type == 3){
                    type    =   "Shipping House Admin";
                }
                else if(_type == 4){
                    type    =   "Accounting House Admin";
                }
                
            //}
        }
        req.userType    =   type;
        console.log(req.userType)
        return next();
    }
    else if(req.user.isUser){
        res.redirect('/');
    }
    else
        res.redirect('/admin/login')
}

exports.isUseLoggedIn  =   function(req, res, next) {
    console.log("Login_Check: ",req.user)
    if (req.isAuthenticated() && req.user != undefined 
        && req.user.isUser != undefined 
        && req.user.isUser==1 && req.user.isRegPaid != undefined
     && req.user.isRegPaid == 1 && req.user.isOTPVerified != 0)
    {

    // && req.user.isRegPaid != undefined
    // && req.user.isRegPaid == 1
        console.log("isAuthenticated");
        console.log(req.user)
        req.userId  =   req.user.pkUserId;



        return next();
    }
    // else if(req.user != undefined && req.user.isRegPaid != undefined
    //     && req.user.isRegPaid == 0){
    //     res.redirect('/pay');
    //     //return next();
    // }
    else if(req.user != undefined && (req.user.isOTPVerified == undefined || req.user.isOTPVerified == 0)){
        var otpManager = require('../businessLayer/OTPManager');
        otpManager.navigateToOTP(req.user,function (userInfo, encodedRedirectId) {
            res.redirect('/twofactor?auth='+encodedRedirectId);
        });
    }
    else
        res.redirect('/login')
}