/**
 * Created by anooj on 11/09/17.
 */
var redis = require("redis"),
    redisClient = redis.createClient();
var Client      =   require('node-rest-client').Client;
var client      =   new Client();
var args = {
    headers: { "Content-Type": "application/json" }
};
var SHIPROCKET_TOKEN_KEY    =   "shiprocket_token";

var base        =   "https://apiv2.shiprocket.in";
var endPoint    =   {
    login           :   base+"/v1/external/auth/login",
    getAllOrders    :   base+"/v1/external/orders/fetch",
    placeOrder      :   base+"/v1/external/orders/create/adhoc"
};

function login(callback) {
    args.data = {
        "email":"j.sreeraj@gmail.com",
        "password":"123456"
    };
    client.post(endPoint.login,args,function (data, response) {
        console.log(data);
        if(data.id != undefined && data.token != undefined){
            redisClient.set(SHIPROCKET_TOKEN_KEY,data.token);
            if(callback != undefined) {
                callback(data.token);
            }
        }else{
            if(callback != undefined) {
                callback(null);
            }
        }
    });
}

function getShipRocketAccessToken(callback) {
    redisClient.get(SHIPROCKET_TOKEN_KEY,function (err, token) {
        if(token != null){
            callback("Bearer "+token);
        }else{
            login(function (token) {
                callback("Bearer "+token);
            })
        }
    })
}

function isTokenSaved(req,res,next) {
    getShipRocketAccessToken(function (token) {
        if(token != null){
            return next();
        }
    })
}

function placeOrder(orderInfo,callback) {
    getShipRocketAccessToken(function (token) {
        args.data = orderInfo
        args.headers["authorization"] = token;

        client.post(endPoint.placeOrder,args,function (data, response) {
            console.log(data);
            callback(data);
        });
    });
}

function getAllOrders() {
    getShipRocketAccessToken(function (token) {
        args.data = {
            "email":"j.sreeraj@gmail.com",
            "password":"123456"
        };
        args.headers["authorization"] = token;
        console.log(args);
        client.get(endPoint.getAllOrders,args,function (data, response) {
            console.log(data);

        });
    })
}

exports.logIn = login;
exports.isTokenValid = isTokenSaved;
exports.getAllOrders = getAllOrders;
exports.placeOrder  =   placeOrder;