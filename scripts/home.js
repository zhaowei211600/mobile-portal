//点击事件
$(function () {

        $("#myWallet").click(function () {
            window.location.href = "./myWallet.html";
        });
        $("#changePassword").click(function () {
            window.location.href = "./changePassword.html";
        });
        $(".wrap-btn-quit").click(function () {
            loadingBlue()
            exitSystem();
        });
});

/*我的钱包*/
var walletList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.common();
        this.initParams();
        //this.searchLayer();
        this.query();
        this.loadMore();
    },
    initParams: function(){
        this.params.pageNum = 1;
        this.params.pageSize = 10;
    },
    common: function(){
        var urlParams = "";
        if(window.location.search.substr(1).split("=")[1]) {
            urlParams = JSON.parse(decodeURI(window.location.search.substr(1).split("=")[1]));
            this.params = urlParams;
        }
    },

    query: function(){
        var _this = this;
        //只显示待接单
        _this.params.pageSize = 10;
        $.ajax({
            url: BASEURL + "/product/list",
            data: JSON.stringify(_this.params),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                var mapData = [];
                if (data.returnCode == "200") {
                    mapData = data.data;
                    $(".monitor-footer .f1 .totals").text(data.total);
                    $(".content-wrap .content-body").show();
                    $(".content-wrap .data-empty").hide();
                    var dataHTML = "";

                    // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                    mapData.forEach(function (item, index, array) {
                        dataHTML +=
                            "<li style=\"margin-bottom: 10px;margin-top: 0;padding: 10px 15px;border: none;background: white;\" onclick='showDetail("+item.id+")'>" +
                            "                <div>" +
                            "                    <div style=\"font-size: 16px;\">\n" +
                            "                        "+item.name+"<span style=\"font-size: 12px;color: #999999;float: right;\">"+item.createTime+"</span>" +
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;\">\n" +
                            "                        预算：<span style=\"color: red;\">￥"+item.budget+"</span>\n" +
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;color: #999999;\">\n" +
                            item.desc +
                            "                    </div>" +
                            "                    <div style=\"display: flex;flex-direction: row;justify-content: space-between;padding-top: 5px;font-size: 12px;\">\n" +
                            "                        <div>工期：<span>"+item.periodStart+"至"+item.periodEnd+"</span></div>\n" +
                            "                        <div>期望交付时间：<span>"+item.expectDeliveryTime+"</span></div>\n" +
                            "                    </div>\n" +
                            "                </div>\n" +
                            "            </li>";
                    });
                    $(".content-body ul").append(dataHTML);
                    if($(".content-body ul").children().length < data.total){
                        $(".load-more").text("加载更多");
                        _this.loadOK = true;
                    }else{
                        $(".load-more").text("没有更多");
                    }
                };
                if(mapData.length <= 0 && $(".content-body ul").children().length<=0 ){
                    $(".content-wrap .content-body").hide();
                    $(".content-wrap .data-empty").show();
                }
            }
        })
    },
    loadMore: function(){
        var _this = this;
        $(window).scroll(function(){
            if(_this.loadOK && ($(this).scrollTop() + $(this).height()) >= $(".load-more").offset().top){
                _this.loadOK = false;

                _this.params.pageNum ++;
                _this.query();
            }
        });
    }
};

+(function(){
    if(!$.cookie('Authorization')){
        greenAlertBox("未登录，需登录后查看");
        setTimeout("window.location.href = './login.html'", 1500);
    }else{
        walletList.init();
    }
})();

function showDetail(id){
    window.location.href = './home-detail.html?productId='+id;
}