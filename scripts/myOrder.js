/*我的钱包*/
var orderList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.initParams();
        this.searchLayer();
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
    // 弹层
    searchLayer: function(){
        var _this = this;
        // 打开
        $(".top-search .search-bar .s-btn").click(function(){
            $(".search-body").show();
            // 禁止页面滚动（解决苹果下 小键盘出现 输入数据时导致的一些问题）
            $("html").css({"overflow": "hidden", "height": "100%"});
            $("body").css({"overflow": "hidden", "height": "100%"});

            _this.resetLayer();
            _this.initParams();
        });
        // 关闭
        $(".top-search .search-body .layer-close").click(function(){
            $("html").css({"overflow": "visible", "height": "auto"});
            $("body").css({"overflow": "visible", "height": "auto"});
            $(".search-body").hide();
        });

        $(".email-status .layer-btn-es").on("click", "a", function(){
            $(this).addClass("on").siblings().removeClass("on");
        });
        $(".check-status .layer-btn-cs").on("click", "a", function(){
            $(this).addClass("on").siblings().removeClass("on");
        });

    },
    // 重置弹层
    resetLayer: function(){
        $(".email-status a").removeClass("on");
        $(".check-status a").removeClass("on");
        $(".search-info input").val("");
    },
    query: function(){
        var _this = this;
        $.ajax({
            url: BASEURL + "/order/user",
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
                    var status = "";
                    // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                    mapData.forEach(function (item, index, array) {
                        if(item.status == '1'){
                            status = '待确认';
                        }else if(item.status == '2'){
                            status = '进行中';
                        }else if(item.status == '3'){
                            status = '已结束';
                        }
                        dataHTML +=
                            "<li>" +
                            "<table>" +
                            "<tr class='standard'>" +
                            " <td colspan='2'>项目名称</td>"+
                            "<td colspan='3'>" + item.productName + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='2'>状态</td>" +
                            "<td colspan='2'>" + status + "</td>" +
                            "<td colspan='1' class='ar'>详情</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='2'>申请时间</td>"+
                            "<td colspan='3'>" + item.createTime + "</td>" +
                            "</tr>" +
                            "</table>" +
                            "<a href='./order-detail.html?productId=" + item.productId + "&orderId="+ item.id +"' class='ticket-info'>" +
                            "<i class='iconfont icon-youjiantou'></i>" +
                            "</a>" +
                            "</li>";
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
    orderList.init();

    if(!$.cookie('Authorization')){
        greenAlertBox("未登录，需登录后查看");
        setTimeout("window.location.href = './login.html'", 1500);
    }else{
        //点击菜单跳转
        $(".home").click(function () {
            window.location.href = "./home.html";
        });
        $(".user_center").click(function () {
            window.location.href = "./userCenter.html";
        });
        $("#find_product").click(function () {
            window.location.href = "./home.html";
        });
    }
})();