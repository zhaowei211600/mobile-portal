loadingBlue()
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var param = GetRequest();


/*显示弹窗*/
function newAlert(){
    $('#box').show();
};
/*关闭弹窗*/
function removeAlert(){
    $('.shadow').hide();
}
/*确认按钮*/
function submitMoney(){

    $.ajax({
        url: BASEURL + "/order/confirm?productId="+param['productId']+"&amount=0.00",
        data: JSON.stringify(param),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                greenAlertBox("下单成功！");
                window.location.href = './myOrder.html';
            }else{
                var errorMessage = result.returnMessage || '下单失败！';
                greenAlertBox(errorMessage);
            }
        }
    });
    removeAlert();
}
function showCustomerBox() {
    $('#customer').show()
}

$(function () {
    $.ajax({
        url: BASEURL + "/product/find?productId="+param['productId'],
        data: JSON.stringify(param),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var status = '';
                var data = result.data;
                $("#productName").html(data.name);
                $("#budget").html("￥"+data.budget);
                $("#expectDeliveryTime").html(data.expectDeliveryTime);
                $("#publishTime").html(data.createTime);
                $("#desc").html(data.desc);
                $("#period").html(data.periodStart+"至"+data.periodEnd);
                if(data.status == '1'){
                    status = '待接单';
                }else if(data.status == '2'){
                    status = '进行中';
                }else if(data.status == '3'){
                    status = '已结束';
                }
                $("#status").html(status);
                $("#protocol").html(data.detail);

            }
        }
    });

    $.ajax({
        url: BASEURL + "/order/count?productId="+param['productId'],
        data: JSON.stringify(param),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                $("#totalUser").html(result.data)
            }
        }
    });

    $("#confirmOrder").click(function () {
        if(!$.cookie('Authorization')){
            greenAlertBox("未登录，需登录后查看");
            setTimeout("window.location.href = './login.html'", 1500);
        }else{
           newAlert();
        }
    });


});
