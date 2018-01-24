/**
 * Created by anooj on 30/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var encoder         =   require('../utils/hashCodeGenerator');

exports.authenticateAdmin   =   function (userInfo, callback) {
    var query   =   "select * from adminUsers where emailId=?";
    var pass    =   encoder.encodeData(userInfo.password);
    var params  =   [userInfo.emailId];
    console.log(pass)
    connection.executeQuery(query,params,function (err,userInfo) {
        if(!err && userInfo != undefined && userInfo.length > 0){
            var user    =   userInfo[0];
            if(user.password == pass){
                var user    =   userInfo[0];
                delete user["password"];
                callback(err,user,"Successfully logged in");
            }else {
                callback(err,null,"Wrong password");
            }
        }else {
            callback(err,null,"EmailId does not exist");
        }
    })
};

exports.isAdminExist    =   function (emailId, callback) {
    connection.executeQuery("select * from adminUsers where emailId = ?",[emailId],function (err, stat) {
        if(!err && stat != undefined && stat.length > 0){
            callback(true,stat);
        }else {
            callback(false,null);
        }
    })
};

exports.addAdmin    =   function (userInfo, callback) {
    var pass    =   encoder.encodeData(userInfo.password);
    userInfo.password   =   pass;
    var query   =   "insert into adminUsers set ?";
    connection.executeQuery(query,userInfo,function (err, stat) {
        callback(err,stat);
    })
}

exports.getAllAdmins    =   function (callback) {
    connection.executeQuery("select * from adminUsers",[],function (err, stat) {
        callback(err,stat);
    })
};

exports.deleteAdmin =   function (adminId, callback) {
    connection.executeQuery("delete from adminUsers where pkAdminUserId=?",[adminId],function (err, stat) {
        callback(err,stat);
    })
};

exports.getAllCounts    =   function (callback) {
    connection.executeQuery("SELECT COUNT(*) as counts from products UNION SELECT COUNT(*) FROM categories UNION SELECT COUNT(*) FROM user UNION SELECT COUNT(*) FROM orders",[],function (err, stat) {
        callback(err,stat);
    })
}
