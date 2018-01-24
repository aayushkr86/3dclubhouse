/**
 * Created by anooj on 20/05/17.
 */
$('document').ready(function () {

    var isPPEdit  =   false;
    var selectedMaterial = -1;
    var availability = "";

    var host    =   window.location.protocol+"//"+window.location.host;
    var currentPath =   window.location.pathname + window.location.search
    if(currentPath.indexOf("/admin/admindoodleprices?id=") != -1){
        isPPEdit = true;
    }else if(currentPath.indexOf("/admin/admindoodleprices") != -1){
        isPPEdit = false;
    }



    
    $("#doodle-price-submit").click(function (e) {
        var isEdit  =   $(this).attr("isEdit");
        if(isEdit == true || isEdit == 'true'){
                updatePP();
        }else {
                addNewPP();
            }
    });


    function updatePP() {

        var cost              =   $("#doodle_price").val();

        var id = $("#doodle-price-submit").attr('doodlepriceid');
        //pk_post_process_id
        var productObj  =   {
            pk_doodle_price_id:id,
            price:cost
        };
        console.log(productObj);
        $.ajax({
            url: '/admin/doodle/updatedoodleprice',
            type: 'POST',
            dataType: 'json',
            data: productObj,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    alert("Successfully updated");
                    window.location.href    =   '/admin/admindoodleprices';
                }
            }
        });
    }
    function addNewPP() {

        var cost              =   $("#doodle_price").val();

        var ppObj  =   {
            //productInfo: {
            price: cost,
            //}
        };
        console.log(ppObj)
        $.ajax({
            url: '/admin/doodle/adddoodleprice',
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


    $("#view-all-doodle-prices").click(function (e) {
        //alert("h")
        $.ajax({
            url:'/admin/doodle/getalldoodleprices',
            type:'GET',
            success:function (data) {
                buildPostProListUI(data.data);
            }
        })
    });

    function buildPostProListUI(postPros) {
        console.log(postPros)
        var form    =   "";
        $("#doodleprice-list-container").empty();
        for(var i=0;i<postPros.length;i++){
            var ppId   =   postPros[i].pk_doodle_price_id;
            //console.log(JSON.stringify(postPros[i]))
            form+="<tr><td>"+(i+1)+"<td>"+postPros[i].price+
                    "<td><a href='/admin/admindoodleprices?id="+ppId+"' class='btn btn-default'><i class='fa fa-fw fa-edit'> </i></a>  </td>"+
                "</tr>";
        }
        $("#doodleprice-list-container").append(form);

    }


});