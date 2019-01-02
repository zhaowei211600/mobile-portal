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

$(function () {
    var param = GetRequest();
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
                orderStatus = data.status;
                $("#productName").html(data.name);
                $("#budget").html("￥"+data.budget);
                $("#expectDeliveryTime").html(data.expectDeliveryTime);
                $("#publishTime").html(data.createTime);
                $("#desc").html(data.desc);
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

            }
        }
    })
});

$(function () {
    $("#apply").click(function () {
        if(orderStatus != '2'){
            greenAlertBox('当前状态无法结项');
            return false;
        }else{
            $(".apply_delivery").show();
            $("#apply").css('display','none');
        }
    });
});