/**
 * Created by anooj on 30/05/17.
 */
var adminManager =   require('../dataAccessLayer/adminUserDA');
exports.authenticateAdmin   =   function (userInfo, callback) {
    adminManager.authenticateAdmin(userInfo,function (err, user, msg) {
        console.log(msg)
        callback(err,user,msg);
    })
};

exports.addAdmin    =   function (adminInfo, callback) {
    adminManager.isAdminExist(adminInfo.emailId,function (isExist) {
        if(!isExist) {
            adminManager.addAdmin(adminInfo, function (err, stat) {
                callback(err, stat)
            });
        }else{
            callback(true, "Admin already exist")
        }
    });
}

exports.getAllAdmins    =   function (callback) {
    adminManager.getAllAdmins(function (err,admins) {
        callback(err,admins);
    });
}

exports.deleteAdmin    =   function (adminId,callback) {
    adminManager.deleteAdmin(adminId,function (err,admins) {
        callback(err,admins);
    });
}

exports.getAllCounts    =   function (callback) {
    adminManager.getAllCounts(function (err,counts) {
        callback(err,counts);
    });
};
