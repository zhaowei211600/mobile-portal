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
    var checkOrder = param['id'] || ''
    $.ajax({
        url: BASEURL + "/check/order/detail?checkOrderId="+checkOrder+'&orderId=',
        data:{},
        type: "post",
        dataType: "json",
        contentType: "application/json",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", getTokenString());
        },
        success: function(result) {
            if (result.returnCode == "200") {
                var status = '';
                var data = result.data;
                orderStatus = data.status;
                $("#createTime").html(data.createTime);
                $('#finishDesc').html(data.finishDesc)
                $('#auditDesc').val(data.auditDesc)
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


            }else {
                var message = result.returnMessage;
                greenAlertBox(message);
            }
        }
    })

    var data = {
        "checkOrderId":checkOrder,
        "pageNum":1,
        "pageSize":"20"
    }
    $.ajax({
        url: BASEURL + "/attachment/order/list",
        data: JSON.stringify(data),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var list =''

                result.data.forEach(function (item,index) {
                    list +='<div><a style="color: #0C4AEC;" href="\'+ BASEURL +\'/user/file/stream?fileName=\'+item.filePath+\'">'+item.fileName+'</a></div>'
                })
                $("#fujian").append(list)

            }
        }
    })
});

$(function () {
    $("#applyDelivery").click(function () {
        param.deliveryDesc = $("#deliveryDesc").val();
        $.ajax({
            url: BASEURL + "/product/apply?productId="+param['productId'] + "&orderId="+ param['orderId'],
            data: JSON.stringify(param),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                if (result.returnCode == "200") {
                    greenAlertBox("申请成功，请等待审核！");
                    window.location.href = './myOrder.html';
                }else if(result.returnCode == "10008"){
                    greenAlertBox("当前项目已关闭，无法提交验收");
                }else{
                    greenAlertBox(result.returnMessage);
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