/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {



    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/admincustomers") != -1){
        var students  = $("#student-list-container").attr('students');
        if(students != undefined && students != null && students != ""){
            students    =   JSON.parse(students);
            console.log(students);
            buildCustomersList(students)
        }
    }
    function buildCustomersList(students) {
        var adminForm  =   "";
        $("#student-list-container").empty();
        for(var i=0;i<students.length;i++){
            console.log(students[i])
            var student =   students[i];
            var categoryId  =   student.pkAdminUserId;
            var adminName    =   student.name + " "+student.lastName;
            var adminEmail  =   student.emailId;
            var adminType   =   student.mobilenumber;


            adminForm+="<tr class=odd role=row><td class=sorting_1>"+(i+1)+
                "<td>"+adminName+"</td>"+
                "<td>"+adminEmail+"</td>"+
                "<td>"+adminType+"</td>"+
                "<td></td>";
        }
        $("#student-list-container").append(adminForm);
    }


});