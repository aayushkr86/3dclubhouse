var LocalStrategy   = require('passport-local').Strategy;
var adminManager =   require('../businessLayer/adminUserBA');
var studentManager =   require('../businessLayer/studentUserBA');
var config      =       require('../utils/config');

var host    =   process.env.RUNNING_HOST;
if(host == 1)
    var fbConfig = config.fb_pro_config;
else
    var fbConfig = config.fb_local_config;

module.exports = function(passport) {
    
    passport.use('local-login', new LocalStrategy({
            usernameField : 'emailId',
            passwordField : 'password',
            passReqToCallback : true
        },
        function (req, email, password, done) {

            var userInfo    =   {
                emailId   :   email,
                password:   password
            };
            console.log(userInfo)
            adminManager.authenticateAdmin(userInfo,function (err, user, msg) {
                console.log(user)
                if(err || user == null){
                    return done(null,msg,false)
                }else{
                    return done(null,user, true);
                }
            });

    }));

    passport.use('user-login', new LocalStrategy({
            usernameField : 'emailId',
            passwordField : 'password',
            passReqToCallback : true
        },
        function (req, email, password, done) {

            var userInfo    =   {
                emailId   :   email,
                password:   password
            };
            console.log("USER: ",userInfo)
            studentManager.authenticateStudent(userInfo,function (err, user, msg) {
                console.log("Authenticate: user-login")
                console.log(user)
                console.log(err)
                console.log(msg);
                if(err || user == null){
                    return done(null,msg,false)
                }else{
                    return done(null,user, true);
                }
            });

        }));



};
