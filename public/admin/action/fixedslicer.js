/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {
    var isPPEdit  =   false;
    var host    =   window.location.protocol+"//"+window.location.host;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/adminfixedslicer?id=") != -1){
        isPPEdit = true;
    }else if(currentPath.indexOf("/admin/adminfixedslicer") != -1){
        isPPEdit = false;
    }

    
    $("#fixedslicerInsert").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){

                updateFixedSlicer();
        }else {

                addNewFixedSlicer();
            }
    });


    function updateFixedSlicer() {
        var quality =   $("#quality").val();
        var strength  =   $("#strength").val();//selectPPMaterial
        var variable_code =   $("#variable_code").val();
        var id = $("#fixedslicerInsert").attr('fixedslicerId');
        //pk_post_process_id
        var productObj  =   {
            pk_fixed_id:id,
            quality: quality,
            strength: strength,
            variable_code: variable_code
        };
        console.log(productObj);
        $.ajax({
            url: '/admin/fixedslicer/updatefixedslicer',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/adminfixedslicer';
                }
            }
        });
    }
    function addNewFixedSlicer() {
        var quality =   $("#quality").val();
        var strength  =   $("#strength").val();//selectPPMaterial
        var variable_code =   $("#variable_code").val(); //selectPPAvailability

        var ppObj  =   {
            //productInfo: {
            quality: quality,
            strength: strength,
            variable_code: variable_code
            //}
        };
        console.log(ppObj)
        $.ajax({
            url: '/admin/fixedslicer/addfixedslicer',
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


    $("#viewfixedslicer").click(function (e) {
        //alert("h")
        $.ajax({
            url:'/admin/fixedslicer/getallfixedslicer',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    });

    function buildPostProListUI(fixedslicer) {
        console.log(fixedslicer)
        var form    =   "";
        $("#fixed-slicer-list-container").empty();
        for(var i=0;i<fixedslicer.length;i++){
            var ppId   =   fixedslicer[i].pk_fixed_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<tr><td>"+(i+1)+"<td>"+fixedslicer[i].quality+
                "<td>"+fixedslicer[i].strength+"<td>"+fixedslicer[i].variable_code+
                    "<td><a href='/admin/adminfixedslicer?id="+ppId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  </td>"+
                "</tr>";
        }
        $("#fixed-slicer-list-container").append(form);

    }


});