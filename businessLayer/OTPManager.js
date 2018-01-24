var redis = require('redis'),
    redisClient = redis.createClient();

function genRand() {
    return Math.floor(Math.random()*89999+10000);
}

exports.navigateToOTP   =   function (userDetails, callback) {
    var btoa  = require('btoa');
    var mob = userDetails.mobilenumber
    var encodedRedirectId = btoa(mob);
    var otp = genRand();
    var data  = userDetails;
    data.otp = otp;
    redisClient.set(mob,JSON.stringify(data));
    callback(data,encodedRedirectId);
}