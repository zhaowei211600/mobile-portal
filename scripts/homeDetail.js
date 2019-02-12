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

/*alertHtml*/
var alertHtml = '<div class="shadow shadowAlert">'+
    '<div class="newAlert">'+
    '<p>请输入期望金额</p>'+
    '<input type="text" name="expectCost" id="expectCost" value="" autocomplete="off"/>'+
    '<div class="buttonBox">'+
    '<button class="sure" id="sure" onclick="submitMoney()">确认</button>'+
    '<button class="cancel" id="cancel" onclick="removeAlert()">取消</button>'+
    '</div>'+
    '</div>'+
    '</div>';
/*显示弹窗*/
function newAlert(){
    $(alertHtml).appendTo("body");
};
/*关闭弹窗*/
function removeAlert(){
    $('.shadowAlert').remove();
}
/*确认按钮*/
function submitMoney(){
    var amount = $("#expectCost").val();
    if(!amountCheck(amount)){
        greenAlertBox("请输入正确的金额");
        return;
    }
    $.ajax({
        url: BASEURL + "/order/confirm?productId="+param['productId']+"&amount="+amount,
        data: JSON.stringify(param),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                greenAlertBox("下单成功！");
                window.location.href = '../pages/myOrder.html';
            }else{
                var errorMessage = result.returnMessage || '下单失败！';
                greenAlertBox(errorMessage);
            }
        }
    });
    removeAlert();
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
                $("#period").html(data.period);
                if(data.status == '1'){
                    status = '待接单';
                }else if(data.status == '2'){
                    status = '进行中';
                }else if(data.status == '3'){
                    status = '待验收';
                }else if(data.status == '4'){
                    status = '已验收';
                }
                $("#status").html(status);

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
            setTimeout("window.location.href = '../pages/login.html'", 1500);
        }else{
           newAlert();
        }
    });


});
