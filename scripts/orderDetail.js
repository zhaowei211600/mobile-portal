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
                    status = '已结束';
                }
                $("#status").html(status);

            }
        }
    })
    getList()
});
var currentPage = 1;
var totalPage = 1;
function getList() {

    var data = {
        "orderId":param['orderId'],
        "pageNum":currentPage,
        "pageSize":"10"
    }
    $.ajax({
        url: BASEURL + "/check/order/list",
        data: JSON.stringify(data),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var list =''
                // $(".content-body ul li").remove();
                var status='';
                totalPage = Math.ceil(result.total/10)
                result.data.forEach(function (item,index) {
                    if(item.status == '1'){
                        status = '待接单';
                    }else if(item.status == '2'){
                        status = '进行中';
                    }else if(item.status == '3'){
                        status = '待验收';
                    }else if(item.status == '4'){
                        status = '已验收';
                    }
                    list += '<li id="'+item.id+'" onclick="jumpDetail(this)">\n' +
                        '                <table>\n' +
                        '                    <tr>\n' +
                        '                        <td colspan="1">验收状态</td>\n' +
                        '                        <td colspan="2" >'+status+'</td>\n' +
                        '                        <td colspan="1" rowspan="2" valign="middle" class="ar">\n' +
                        '                            <span>详情</span>\n' +
                        '                            <i class=\'iconfont icon-youjiantou\' style="font-size: 12px;"></i>\n' +
                        '                        </td>\n' +
                        '                    </tr>\n' +
                        '                    <tr>\n' +
                        '                        <td colspan="1">申请时间</td>\n' +
                        '                        <td colspan="2">'+item.createTime+'</td>\n' +
                        '                    </tr>\n' +
                        '                </table>\n' +
                        '            </li>'
                })
                $(".content-body ul").append(list)

            }
        }
    })
}
/*显示弹窗*/
function newAlert(){
    $('#box').show();
};
/*关闭弹窗*/
function removeAlert(){
    $('.shadow').hide();
}
function submitMoney() {
    var url = 'http://www.zhaobangshou.net.cn'

    var clipboard = new Clipboard('#share', {
        text: function() {
            return url;
        }
    });

    clipboard.on('success', function (e) {
        greenAlertBox('复制成功！');
        return;
    });

    clipboard.on('error', function (e) {
        return;
    });

}
function jumpDetail(even) {
    window.location.href = './order-apply.html?id='+even.id;
}
//--------------上拉加载更多---------------
         //获取滚动条当前的位置
         function getScrollTop() {
                 var scrollTop = 0;
                 if(document.documentElement && document.documentElement.scrollTop) {
                         scrollTop = document.documentElement.scrollTop;
                     } else if(document.body) {
                         scrollTop = document.body.scrollTop;
                     }
                 return scrollTop;
             }

         //获取当前可视范围的高度
         function getClientHeight() {
                 var clientHeight = 0;
                 if(document.body.clientHeight && document.documentElement.clientHeight) {
                         clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
                     } else {
                         clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
                     }
                 return clientHeight;
             }

         //获取文档完整的高度
         function getScrollHeight() {
                 return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
             }

         //滚动事件触发
         window.onscroll = function() {
                 if(getScrollTop() + getClientHeight() == getScrollHeight()) {

                     currentPage++;
                     if(currentPage > totalPage){
                         return
                     }
                     getList()
                 }
             }
         //-----------------结束--------------------
