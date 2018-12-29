/*资产管理 页面*/
var assetsManage = {
    init: function(){
        this.query();
    },
    query: function(){
        $.ajax({
            url: BASEURL+"/asset/overview",
            type: "post",
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            success:function (data) {
                console.log(data);
                if(data.returnCode == "200"){
                    var mapData = data.data;
                    $(".ticketCount").text(mapData.totalCheck);
                    $(".monitorCount").text(mapData.onMonitor);
                    $(".statusChgeCount").text(mapData.totalChangeState);
                    $(".repeatUseCount").text(mapData.totalReuse);
                }
            }
        })
    }
};

+(function(){
    // alert($.cookie('Authorization'));
    if(!$.cookie('Authorization')){
        greenAlertBox("令牌已失效,请重新登录");
        setTimeout("window.location.href = '/wechat/src/pages/login.html'", 1500);
    }else{
        assetsManage.init();
    }

})();