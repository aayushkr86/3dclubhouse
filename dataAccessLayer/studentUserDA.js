/**
 * Created by anooj on 30/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var encoder         =   require('../utils/hashCodeGenerator');

exports.authenticateStudent   =   function (userInfo, callback) {
    var query   =   "select * from user where emailId=?";
    var pass    =   encoder.encodeData(userInfo.password);
    var params  =   [userInfo.emailId];
    console.log(pass)
    connection.executeQuery(query,params,function (err,userInfo) {
        if(!err && userInfo != undefined && userInfo.length > 0){
            var user    =   userInfo[0];
            if(user.password == pass){
                var user    =   userInfo[0];
                delete user["password"];
                console.log("After Login query: ",user)
                if(user.emailId == "admin@cyber.com"){
                    callback(err,user,"Successfully logged in");//ByPass Login
                }else{
                    callback(err,user,"Successfully logged in");
                }

            }else {
                callback(err,null,"Wrong password");
            }
        }else {
            callback(err,null,"EmailId does not exist");
        }
    })
};

exports.isStudentUserExist    =   function (emailId, callback) {
    connection.executeQuery("select * from user where emailId = ?",[emailId],function (err, stat) {
        if(!err && stat != undefined && stat.length > 0){
            callback(true,stat[0]);
        }else {
            callback(false,null);
        }
    })
};

exports.addStudentUser    =   function (userInfo, callback) {
    var pass    =   encoder.encodeData(userInfo.password);
    userInfo.password   =   pass;
    var query   =   "insert into user set ?";
    connection.executeQuery(query,userInfo,function (err, stat) {
        callback(err,stat);
    })
};

exports.updateUser  =   function (userInfo, userId, callback) {
    connection.executeQuery("update user set ? where pkUserId=?",[userInfo,userId],function (err, stat) {
        callback(err,stat);
    })
};

exports.getUser =   function (userId, callback) {
    //req.login(user)
    connection.executeQuery("select * from user where pkUserId=?",[userId],function (err, stat) {
        if(!err && stat != undefined && stat.length > 0) {
            stat    =   stat[0];
            delete stat["password"];
            callback(err, stat);
        }
    })
};

exports.getAllUsers =   function (callback) {
    //req.login(user)
    connection.executeQuery("select name,lastName,emailId,schoolName,gender,mobilenumber from user",[],function (err, stat) {
        if(!err && stat != undefined && stat.length > 0) {

            callback(err, stat);
        }
    })
};

exports.getBillingAddress   =   function (userId, callback) {
    connection.executeQuery("select * from userAddress where fkUserId=? and isBilling=1 and isAddressDeleted=0",[userId],function (err, stat) {
        callback(err,stat);
    })
}

exports.getShippingAddress   =   function (userId, callback) {
    connection.executeQuery("select * from userAddress where fkUserId=? and isBilling=0 and isAddressDeleted=0",[userId],function (err, stat) {
        callback(err,stat);
    })
};

exports.addBillingUserAddress=  function (userId, address, callback) {
    address.fkUserId=userId;
    address.isBilling=1;
    console.log(address)
    connection.executeQuery("insert into userAddress set ?",[address],function (err, stat) {
        callback(err,stat);
    })
};
exports.addShippingUserAddress=  function (userId, address, callback) {

    address.fkUserId=userId;
    address.isBilling=0;
    console.log("Address : ",address)
    connection.executeQuery("insert into userAddress set ?",[address],function (err, stat) {
        callback(err,stat);
    })
};
exports.updateAddress   =   function (addressId, address, callback) {
    delete address["pkAddressId"];
    connection.executeQuery("update userAddress set ? where pkAddressId=?",[address,addressId],function (err, stat) {
        callback(err,stat);
    })
}