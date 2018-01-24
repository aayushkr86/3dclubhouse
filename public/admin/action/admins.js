/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {

    
    $("#admin-submit").click(function () {

        var adminName    =   $("#adminName").val();
        var adminEmail    =   $("#adminEmail").val();
        var adminPass  =   $("#adminPass").val();
        var adminType              =   $("#adminType option:selected").val();

        var adminObj     =   {
            name:adminName,
            emailId:adminEmail,
            password:adminPass,
            type:adminType
        };
        
            $.ajax({
                url: '/admin/addadmin',
                type: 'POST',
                data: adminObj,
                success: function (data) {
                    console.log(data)
                    if (data.success != undefined && data.success==true) {
                        alert("Added successfully")
                        window.location.reload();
                    }
                    else {
                        if(data.success==false){
                            alert(data.errmessage);
                        }
                        else
                            alert("Failed to add");
                    }
                }
            })

    });

    $("#view-all-admin-list").click(function (e) {
        getCategories();
    });

    function getCategories() {
        $.ajax({
            url:'/admin/getalladmins',
            type:'GET',
            success:function (categoryResult) {
                console.log(categoryResult)
                if(categoryResult.success != undefined && categoryResult.success== true){
                    var categories  =   categoryResult.data;
                    buildAdminsList(categories)
                }
            }
        });
    }
    
    function buildAdminsList(admins) {
        var adminForm  =   "";
        $("#admin-list-container").empty();
        for(var i=0;i<admins.length;i++){
            console.log(admins[i])
            var adminInfo =   admins[i];
            var categoryId  =   adminInfo.pkAdminUserId;
            var adminName    =   adminInfo.name;
            var adminEmail  =   adminInfo.emailId;
            var adminType   =   adminInfo.type;

            if(adminType == 0){
                adminType="Admin"
            }
            else if(adminType ==1){
                adminType="Design House"
            }
            else if(adminType ==2){
                adminType="Print House"
            }
            else if(adminType ==3){
                adminType="Shipping House"
            }
            else if(adminType ==4){
                adminType="Accounting House"
            }

            adminForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+adminName+"</td>"+
                "<td>"+adminEmail+"</td>"+
                "<td>"+adminType+"</td>"+
                "<td><button class='deleteadmin btn btn-danger btn-small'data-tid=13046 id="+categoryId+"><i class='fa fa-fw fa-times'></i></button></td>";
        }
        $("#admin-list-container").append(adminForm);
    }

    $('body').on('click','.deleteadmin',function () {
        var categoryId  =   $(this).attr("id");
        $.ajax({
            url:'/admin/deleteadmin',
            type:'POST',
            data:{pkAdminUserId:categoryId},
            success:function (categoryResult) {
                console.log(categoryResult)
                var data    =   categoryResult;
                if (data.success != undefined) {
                    if (data.success == true) {
                        alert("Successfully deleted");
                        window.location.reload();
                    }
                    else {
                        alert(data.errmessage);
                    }
                }
                else {
                    alert("Failed to delete");
                }
            }
        });
    });

});