var orderStatus;
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
                var deliveryStatus = '';
                orderStatus = data.status;
                $("#productName").html(data.name);
                $("#budget").html("￥"+data.budget);
                $("#expectDeliveryTime").html(data.expectDeliveryTime);
                $("#publishTime").html(data.createTime);
                $("#period").html(data.period);
                $("#contactPhone").html(data.phone);
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
                if(dateCompare(data.expectDeliveryTime)){
                    deliveryStatus = '正常';
                }else{
                    deliveryStatus = '超期';
                }
                $("#deliveryStatus").html(deliveryStatus);
                $("#deliveryTime").html(dateFormat(new Date()));
            }
        }
    })
});

$(function () {
    $("#applyDelivery").click(function () {
        param.deliveryDesc = $("#deliveryDesc").val();
        $.ajax({
            url: BASEURL + "/product/apply?productId="+param['productId'],
            data: JSON.stringify(param),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                if (result.returnCode == "200") {
                    greenAlertBox("申请成功，请等待审核！");
                    window.location.href = '../pages/myOrder.html';
                }
            }
        })
    });
});

function dateCompare(time) {
    var curTime = new Date();
    var expectDeliveryTime = new Date(Date.parse(time));
//进行比较
    return (curTime<= expectDeliveryTime);
}

function dateFormat(val, row) {
    if (val != null) {
        var date = new Date(val);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
}