/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isPPEdit  =   false;
    var selectedMaterial = -1;
    var availability = "";

    var host    =   window.location.protocol+"//"+window.location.host;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/admintaxconfig?id=") != -1){
        isPPEdit = true;
    }else if(currentPath.indexOf("/admin/admintaxconfig") != -1){
        isPPEdit = false;
    }


    $("#taxInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){

                addTaxConf();
        }else {

                addTaxConf();
            }
    });



    function addTaxConf() {
        var markup_1 =   $("#markup_1").val();
        var markup_2  =   $("#markup_2").val();//selectPPMaterial
        var gst_print =   $("#gst_print").val(); //selectPPAvailability
        var discount_print              =   $("#discount_print").val();
        var shipping =   $("#shipping").val();

        var ppObj  =   {
            //productInfo: {
            markup_1:markup_1,
            markup_2: markup_2,
            gst_print: gst_print,
            shipping:shipping,
            discount_print: discount_print
            //}
        };
        console.log(ppObj)
        $.ajax({
            url: '/admin/taxconf/addtaxconf',
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


    $("#viewTaxConf").click(function (e) {
        //alert("h")
        $.ajax({
            url:'/admin/taxconf/getalltaxconf',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    });

    function buildPostProListUI(postPros) {
        console.log(postPros)
        var form    =   "";
        $("#taxconf-list-container").empty();
        for(var i=0;i<postPros.length;i++){
            var ppId   =   postPros[i].pk_taxconf_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<tr><td>"+(i+1)+"<td>"+postPros[i].markup_1+
                "<td>"+postPros[i].markup_2+"<td>"+postPros[i].gst_print+
                "<td>"+postPros[i].discount_print+
                    "<td><a href='/admin/admintaxconfig?id="+ppId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  </td>"+
                "</tr>";
        }
        $("#taxconf-list-container").append(form);

    }


});