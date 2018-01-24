/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isPPEdit  =   false;
    var host    =   window.location.protocol+"//"+window.location.host;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/adminpackageconf?id=") != -1){
        isPPEdit = true;
    }else if(currentPath.indexOf("/admin/adminpackageconf") != -1){
        isPPEdit = false;
    }

    
    $("#packageconfInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){

                updatePackageConf();
        }else {

                addNewPackageConf();
            }
    });


    function updatePackageConf() {
        var min_length =   $("#min_length").val();
        var max_length  =   $("#max_length").val();
        var min_breadth =   $("#min_breadth").val();
        var max_breadth          =   $("#max_breadth").val();
        var min_height =   $("#min_height").val();
        var max_height          =   $("#max_height").val();
        var package_cost          =   $("#package_cost").val();

        var id = $("#packageconfInsert").attr('packageConfId');
        //pk_post_process_id
        var productObj  =   {
            pk_package_conf_id:id,
            min_length:min_length,
            max_length: max_length,
            min_breadth: min_breadth,
            max_breadth: max_breadth,
            min_height: min_height,
            max_height: max_height,
            package_cost:package_cost
        };
        console.log(productObj);
        $.ajax({
            url: '/admin/packageconf/updatepackageconf',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/adminpackageconf';
                }
            }
        });
    }
    function addNewPackageConf() {
        var min_length =   $("#min_length").val();
        var max_length  =   $("#max_length").val();
        var min_breadth =   $("#min_breadth").val();
        var max_breadth          =   $("#max_breadth").val();
        var min_height =   $("#min_height").val();
        var max_height          =   $("#max_height").val();
        var package_cost          =   $("#package_cost").val();

        var ppObj  =   {
            //productInfo: {
            min_length:min_length,
            max_length: max_length,
            min_breadth: min_breadth,
            max_breadth: max_breadth,
            min_height: min_height,
            max_height: max_height,
            package_cost:package_cost
            //}
        };
        console.log(ppObj)
        $.ajax({
            url: '/admin/packageconf/addpackageconf',
            type: 'POST',
            dataType: 'json',
            data: ppObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    window.location.reload();
                }
            }
        });
    }


    $("#viewPackageConf").click(function (e) {
        //alert("h")
        $.ajax({
            url:'/admin/packageconf/getallpackageconf',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    });

    function buildPostProListUI(printConf) {
        console.log(printConf)
        var form    =   "";
        $("#package-conf-list-container").empty();
        for(var i=0;i<printConf.length;i++){
            var ppId   =   printConf[i].pk_package_conf_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<tr><td>"+(i+1)+"<td>"+printConf[i].min_length+
                "<td>"+printConf[i].max_length+"<td>"+printConf[i].min_breadth+
                "<td>"+printConf[i].max_breadth+
                "<td>"+printConf[i].min_height+
                "<td>"+printConf[i].max_height+
                "<td>"+printConf[i].package_cost+
                    "<td><a href='/admin/adminpackageconf?id="+ppId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  </td>"+
                "</tr>";
        }
        $("#package-conf-list-container").append(form);

    }


});