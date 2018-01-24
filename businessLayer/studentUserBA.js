/**
 * Created by anooj on 30/05/17.
 */
var studentManager =   require('../dataAccessLayer/studentUserDA');
exports.authenticateStudent   =   function (userInfo, callback) {
    studentManager.authenticateStudent(userInfo,function (err, user, msg) {
        console.log(msg)
        callback(err,user,msg);
    })
};

exports.addStudentUser    =   function (studentInfo, callback) {
    console.log(studentInfo);
    studentManager.isStudentUserExist(studentInfo.emailId,function (isExist,user) {
        if(!isExist) {
            studentManager.addStudentUser(studentInfo, function (err, stat) {
                callback(err, stat)
            });
        }else if(user!= null && user != undefined && user.isRegPaid ==0){
            user.insertId=user.pkUserId;
            callback(false, user)
        }
        else{
            callback(true, "User already exist")
        }
    });
};

exports.getAllStudentUsers    =   function (callback) {
    studentManager.getAllUsers(function (err, stat) {
        callback(err, stat)
    });
}

exports.updateUser  =   function (studentInfo, studentId, callback) {
    
            studentManager.updateUser(studentInfo,studentId, function (err, stat) {
                studentManager.getUser(studentId,function (err, user) {
                    callback(err, user);
                });
            });
    
};

exports.addBillingUserAddress  =   function (address,userId,callback) {
    studentManager.getBillingAddress(userId,function (err, fetchedAddress) {
        if(!err && fetchedAddress != undefined && fetchedAddress.length > 0){
            var addressId   =   fetchedAddress[0].pkAddressId;
            address.fkUserId    =   userId;
            studentManager.updateAddress(addressId,address,function (err, status) {
                callback(err,status);
            })
        }else{
            studentManager.addBillingUserAddress(userId,address,function (err, status) {
                callback(err,status);
            })
        }
    })
};

exports.placeOrder = function () {

}

exports.addShippingUserAddress  =   function (address,userId,callback) {
    studentManager.getShippingAddress(userId,function (err, fetchedAddress) {
        console.log(fetchedAddress)
        if(!err && fetchedAddress != undefined && fetchedAddress.length > 0){
            var addressId   =   fetchedAddress[0].pkAddressId;
            address.fkUserId    =   userId;
            studentManager.updateAddress(addressId,address,function (err, status) {
                callback(err,status);
            })
        }else{
            studentManager.addShippingUserAddress(userId,address,function (err, status) {
                callback(err,status);
            })
        }
    })
};

exports.getShippingAddress  =   function (userId, callback) {
    studentManager.getShippingAddress(userId,function (err, address) {
        if(!err && address != undefined && address.length > 0){
            callback(err,address[0]);
        }else{
            var addr={
                pkAddressId:"",
                fkUserId:"",
                firstName:"",
                lastName:"",
                address:"",
                pincode:"",
                city:"",
                state:"",
                isAddressDeleted:"",
                isBilling:"",
                shipEmailId:"",
                shipMobileNumber:"",
                isNull:true
            }
            callback(err,addr);
        }
    });
}

exports.getBillingAddress  =   function (userId, callback) {
    studentManager.getBillingAddress(userId,function (err, address) {
        if(!err && address != undefined && address.length > 0){
            callback(err,address[0]);
        }else{
            var addr={
                pkAddressId:"",
                fkUserId:"",
                firstName:"",
                lastName:"",
                address:"",
                pincode:"",
                city:"",
                state:"",
                isAddressDeleted:"",
                isBilling:"",
                shipEmailId:"",
                shipMobileNumber:"",
                isNull:true
            }
            callback(err,addr);
        }
    });
}