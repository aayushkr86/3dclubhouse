/**
 * Created by anooj on 13/09/17.
 */
$('document').ready(function () {

    var apiEndPoint =   {
        getAllPendingOrders:'/admin/getallpendingorders',
        changeOrderStatus   :'/admin/changeorderstatus'
    };

    getAllPendingOrders();

    function getAllPendingOrders() {
        $.ajax({
            url:apiEndPoint.getAllPendingOrders,
            type:'GET',
            success:function (orders) {
                console.log(orders);
                buildPrintOrderUI(orders);
            }
        })
    }

    function buildPrintOrderUI(orderResp) {
        //<div class="box box-warning"><div class="box-header with-border"><h3 class=box-title>Collapsable</h3><div class="box-tools pull-right"><button class="btn btn-box-tool"data-widget=collapse type=button><i class="fa fa-minus"></i></button></div></div><div class=box-body>The body of the box</div></div>
        var orderForm = '';
        for(var i=0;i<orderResp.length;i++){
            var mainOrder = orderResp[i];
            console.log(mainOrder)
            var currentMainOrderStatus  =   mainOrder.orderStatus;
            var currentMainOrderDate    =   mainOrder.orderedOn;
            currentMainOrderDate        =   currentMainOrderDate.split("T");
            currentMainOrderDate        =   currentMainOrderDate[0];
            var ordersOfCurrent         =   mainOrder.orders;
            var currentMainOrderPrice   =   "Rs. "+mainOrder.discountedAmount;
            if(mainOrder.discountedAmount == null || mainOrder.discountedAmount == undefined){
                currentMainOrderPrice   =   "Rs. "+mainOrder.totalAmount;
            }
            var orderNum    =   mainOrder.orderGroupId;
            var currentMainOrderNumber  =   "#"+mainOrder.orderGroupId;
            //</div></div></div>
            var styleTitle  =   "";
            if(currentMainOrderStatus == "SHIPPED"){
                styleTitle  =   "text-decoration: line-through;"
            }
            orderForm   += '<div class="box box-success panel"><div class="box-header with-border"><h4 class=box-title><span style="'+styleTitle+'" id="title_'+orderNum+'"><a aria-expanded=true class=collapsed data-parent=#accordion data-toggle=collapse ' +
                'href=#collapse_'+orderNum+'>'+currentMainOrderNumber+' - '+mainOrder.emailId+'</a></span></h4><span style="float: right;">Orders: '+ordersOfCurrent.length+', Placed On: '+currentMainOrderDate+', Status: <span id="group_'+orderNum+'">'+currentMainOrderStatus+'</span></span>' +
                '</div><div class="collapse panel-collapse"aria-expanded=false id=collapse_'+orderNum+' style=height:0><div class=box-body>';


            var orderArrForm            =   '';
            for(var j=0;j<ordersOfCurrent.length;j++){
                var currentOrderInfo = ordersOfCurrent[j];
                var orderStat   =   currentOrderInfo.orderStatus;
                var ord =   "";
                if(orderStat == "ORDERED"){
                    ord += "<option selected value=1>ORDERED"
                }else{
                    ord += "<option value=1>ORDERED"
                }

                if(orderStat == "PRINTING"){
                    ord += "<option selected value=2>PRINTING"
                }else{
                    ord += "<option value=2>PRINTING"
                }

                if(orderStat == "SHIPPED"){
                    ord += "<option selected value=3>SHIPPED"
                }else{
                    ord += "<option value=3>SHIPPED"
                }

                orderArrForm    += '<div class="box box-solid"><div id="box_'+currentOrderInfo.pkOrderId+'" class="box-header with-border">' +
                    '<h3 class=box-title>#'+currentOrderInfo.pkProductId+' - '+currentOrderInfo.productName+'</h3></div><div class=box-body>' +
                    '<ul><li>Breadth: '+currentOrderInfo.breadth+'' +
                    '<li>Height: '+currentOrderInfo.height+'' +
                    '<li>Length: '+currentOrderInfo.length+'' +
                    '<li>Quality: '+currentOrderInfo.quality+'' +
                    '<li>Quantity: '+currentOrderInfo.quantity+'</ul>' +
                    '<span style=float:right><select id="select_'+currentOrderInfo.pkOrderId+'" name=selectStatus >' +
                    ord+
                    '</select><a id='+currentOrderInfo.pkOrderId+' class="print_order_status btn btn-app"><i class="fa fa-save"></i> Save</a></span>' +
                    '</div></div>';


            }
            orderForm   += orderArrForm+"</div></div></div>";

            //orderForm   += "<div class=cart-actions>Status : <strong>"+currentMainOrderStatus+"</strong></div></div>"
        }
        //print(orderForm)
        $("#print-order-list").append(orderForm)
    }


    $('body').on('click','.print_order_status',function () {
        var currentOrderId = $(this).attr('id');
        var status = $('#select_'+currentOrderId).find(":selected").text();
        var body    =   {
            pkOrderId:currentOrderId,
            orderStatus:status
        };
        console.log(body);
        $.ajax({
            url:apiEndPoint.changeOrderStatus,
            type:'POST',
            data:body,
            success:function (data) {
                console.log(data);
                data    =   data[0];
                $("#group_"+data.orderGroupId).text(data.orderStatus)
                if(data.orderStatus == "SHIPPED"){
                    $("#title_"+data.orderGroupId).css("text-decoration","line-through");
                }else{
                    $("#title_"+data.orderGroupId).css("text-decoration","none  ");
                }
            }
        })
    })

});
