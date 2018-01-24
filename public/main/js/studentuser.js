/**
 * Created by anooj on 19/06/17.
 */
$('document').ready(function () {



    let updateStudentNameId =   $("#update-user-name");
    let updateStudentEmailId =   $("#update-user-email");
    let studentFirstNameId =   $("#forFName");
    let studentSecNameId =   $("#forLName");
    let studentEmailId =   $("#forEmailId");
    let studentMobId =   $("#forMobNum");

//alert("jjjj")
    $("#user-login").click(function () {
        authenticateUser();
    });

    $('body').on('click','#user-register',function (e) {
        //registerUser();
    })
    $("#user-register").click(function () {
        //alert("j")
        //registerUser();
    });

    function registerUser() {
        alert("q")
        var userObj =   {
            emailId:$("#reg-emailId").val(),
            name:$("#reg-name").val(),
            gender:$("#reg-gender").val(),
            password:$("#reg-password").val(),
            mobileNumber:$("#reg-mob").val(),
            schoolName:$("#reg-school").val(),
            lastName:$("#reg-lname").val()
        };
        if(isNullorUndefined(userObj.emailId)){
            //Show error in emailId
            return false;
        }
        if(isNullorUndefined(userObj.name)){
            return false;
        }
        if(isNullorUndefined(userObj.password)){
            return false;
        }
        $.ajax({
            url: '/user/register',
            type: 'POST',
            data: userObj,
            success: function (data) {
                console.log(data)

            }
        })
    }

    function validateForm(){
        var x = document.forms["account_create"]["name"].value;
        if (x == "") {
            alert("Name must be filled out");
            return false;
        }
    }
    function authenticateUser() {
        var redirectTo="/";
        var userObj =   {
            emailId:$("#student-email").val(),
            password:$("#student-password").val(),
            redirectTo:getRedirectURL()
        };
        $.ajax({
            url: '/user/login',
            type: 'POST',
            data: userObj,
            success: function (data) {
                console.log(data)
                if(data.success){
                    console.log(getRedirectURL());
                    window.location.replace(getRedirectURL());
                }else{
                    alert("Invalid username/password")
                }
            }
        })
    }

    function getRedirectURL() {
        var currentURL  =   window.location.protocol+"//"+window.location.host+window.location.pathname;
        return currentURL;
    }

    function isNullorUndefined(fieldName) {
        if(fieldName != null
            && fieldName != undefined
            && fieldName != ""){
                return false;
        }else{
                return true;
        }
    }

    updateStudentNameId.click(function () {
        var userObj =   {
            name:studentFirstNameId.val(),
            lastName:studentSecNameId.val()
        }
        console.log(userObj);
        updateUser(userObj);
    });

    updateStudentEmailId.click(function () {
        var userObj =   {
            emailId:studentEmailId.val(),
            mobilenumber:studentMobId.val()
        }
        console.log(userObj);
        updateUser(userObj);
    })

    function updateUser(userObj) {
        $.ajax({
            url:'/updateuserinfo',
            type:'POST',
            data:userObj,
            success:function (data) {
                console.log(data)
                if(data.success){
                    window.location.reload();
                }
            }
        })
    }

    $("#ship-address-submit").click(function () {
        var firstName   =   $("#ship-firstName").val();
        var lastName    =   $("#ship-lastName").val();
        var emailId     =   $("#ship-emailId").val();
        var mobileNumber     =   $("#ship-mobile").val();
        var address     =   $("#ship-address").val();
        var city     =   $("#ship-city").val();
        var pincode     =   $("#ship-pincode").val();
        var state     =   $("#ship-state option:selected").val();
        var addrObj={
            firstName:firstName,
            lastName:lastName,
            address:address,
            pincode:pincode,
            city:city,
            state:state,
            shipEmailId:emailId,
            shipMobileNumber:mobileNumber
        };
        if(firstName != "" && firstName != null &&
            address.trim() != "" && address != "" && address != null && address.trim() != "") {
            addShippingAddress(addrObj);
        }
    });
    $("#bill-address-submit").click(function () {
        var firstName   =   $("#ship-firstName").val();
        var lastName    =   $("#ship-lastName").val();
        var emailId     =   $("#ship-emailId").val();
        var mobileNumber     =   $("#ship-mobile").val();
        var address     =   $("#ship-address").val();
        var city     =   $("#ship-city").val();
        var pincode     =   $("#ship-pincode").val();
        var state     =   $("#ship-state option:selected").val();
        var addrObj={
            firstName:firstName,
            lastName:lastName,
            address:address,
            pincode:pincode,
            city:city,
            state:state,
            shipEmailId:emailId,
            shipMobileNumber:mobileNumber
        };
        if(firstName != "" && firstName != null &&
            address.trim() != "" && address != "" && address != null && address.trim() != "") {
            addBillingAddress(addrObj);
        }
    });
    function addShippingAddress(addressObj) {
        $.ajax({
            url:'/addshippinguseraddress',
            type:'POST',
            data:addressObj,
            success:function (data) {
                if(data.success){
                    window.location.reload();
                }
            }
        })
    }

    function addBillingAddress(addressObj) {
        $.ajax({
            url:'/addbillinguseraddress',
            type:'POST',
            data:addressObj,
            success:function (data) {
                if(data.success){
                    window.location.reload();
                }
            }
        })
    }

    let currentPath     =   window.location.pathname + window.location.search;
    if(currentPath.indexOf("myaccount-shipping") != -1 || currentPath.indexOf("myaccount-billing") != -1 || currentPath.indexOf("checkout") != -1){
        var shipStateId =   $("#ship-state").attr("state");
        if(shipStateId != null && shipStateId != undefined){
            $("#ship-state").val(shipStateId);
        }

    }

});
