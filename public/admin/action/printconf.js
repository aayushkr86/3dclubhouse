/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isPPEdit  =   false;
    var host    =   window.location.protocol+"//"+window.location.host;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/adminprinterconf?id=") != -1){
        isPPEdit = true;
    }else if(currentPath.indexOf("/admin/adminprinterconf") != -1){
        isPPEdit = false;
    }

    
    $("#printconfInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){

                updatePrinterConf();
        }else {

                addNewPrinterConf();
            }
    });


    function updatePrinterConf() {
        var printer_code =   $("#printer_code").val();
        var min_dimension  =   $("#min_dimension").val();//selectPPMaterial
        var max_dimension =   $("#max_dimension").val(); //selectPPAvailability
        var printer_rate              =   $("#printer_rate").val();
        var id = $("#printconfInsert").attr('printConfId');
        //pk_post_process_id
        var productObj  =   {
            pk_printer_dim_id:id,
            printer_code:printer_code,
            min_dimension: min_dimension,
            max_dimension: max_dimension,
            printer_rate: printer_rate
        };
        console.log(productObj);
        $.ajax({
            url: '/admin/printconf/updateprintconf',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/adminprinterconf';
                }
            }
        });
    }
    function addNewPrinterConf() {
        var printer_code =   $("#printer_code").val();
        var min_dimension  =   $("#min_dimension").val();//selectPPMaterial
        var max_dimension =   $("#max_dimension").val(); //selectPPAvailability
        var printer_rate              =   $("#printer_rate").val();

        var ppObj  =   {
            //productInfo: {
            printer_code:printer_code,
            min_dimension: min_dimension,
            max_dimension: max_dimension,
            printer_rate: printer_rate
            //}
        };
        console.log(ppObj)
        $.ajax({
            url: '/admin/printconf/addprintconf',
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


    $("#viewPrintConf").click(function (e) {
        //alert("h")
        $.ajax({
            url:'/admin/printconf/getallprintconf',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    });

    function buildPostProListUI(printConf) {
        console.log(printConf)
        var form    =   "";
        $("#print-conf-list-container").empty();
        for(var i=0;i<printConf.length;i++){
            var ppId   =   printConf[i].pk_printer_dim_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<tr><td>"+(i+1)+"<td>"+printConf[i].printer_code+
                "<td>"+printConf[i].min_dimension+"<td>"+printConf[i].max_dimension+
                "<td>"+printConf[i].printer_rate+
                    "<td><a href='/admin/adminprinterconf?id="+ppId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  </td>"+
                "</tr>";
        }
        $("#print-conf-list-container").append(form);

    }


});