/*我的资产*/
var assetsList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.initParams();
        this.common();
        this.searchLayer();
        this.query();
        this.loadMore();
    },
    initParams: function(){
        this.params.page = 1;
        this.params.pageSize = 10;
        this.params.sendStatus = "";
        this.params.checkResult = "";
        this.params.salesName = "";
        this.params.invoiceCode = "";
        this.params.invoiceNumber = "";
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

        // 重置
        $(".reset").click(_this.resetLayer);

        // 确认
        $(".submit").click(function(){
            _this.params.sendStatus = $(".email-status .layer-btn-es a").hasClass("on") ? $(".email-status .layer-btn-es .on").attr("data-sendStatus") : "";
            _this.params.checkResult = $(".check-status .layer-btn-cs a").hasClass("on") ? $(".check-status .layer-btn-cs .on").attr("data-checkResult") : "";
            _this.params.salesName = $(".search-info .salesName").val();
            _this.params.invoiceCode = $(".search-info .invoiceCode").val();
            _this.params.invoiceNumber = $(".search-info .invoiceNumber").val();

            $(".content-body ul").html("");

            _this.query();
            $("html").css({"overflow": "visible", "height": "auto"});
            $("body").css({"overflow": "visible", "height": "auto"});
            $(".search-body").hide();
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
            url: BASEURL + "/invoice/check/list",
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
                    var emailStatus = "";
                    var monitorStatusHTML = "";
                    var checkStatus = "";
                    // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                    mapData.forEach(function (item, index, array) {
                        emailStatus = item.sendStatus == "1" ? "email-ok" : "email-no";
                        switch (item.monitorStatus) {
                            case "0" :
                            case "2" :
                                monitorStatusHTML = "<span class='monitor-ok'>已监控</span>";
                                break;
                            case "1" :
                            case "3" :
                                monitorStatusHTML = "<span class='monitor-no'>未监控</span>";
                                break;
                            default:
                                monitorStatusHTML = "<span class='monitor-no'>未监控</span>";
                        }
                        if (item.checkResult == "1"){
                            checkStatus = "icon-yinzhang";
                        }else if (item.checkResult == "2"){
                            checkStatus = "icon-gaizhangyushijiyizhi";
                        }else {
                            checkStatus = "";
                        }
                        // checkStatus = item.checkResult == "1" ? "icon-yinzhang" : "";

                        dataHTML +=
                            "<li>" +
                            "<div class='is-email " + emailStatus + "'><span></span></div> " +
                            "<table>" +
                            "<tr class='standard'>" +
                            "<td>日期</td>" +
                            "<td>" + item.checkDate.split(" ")[0] + "</td>" +
                            "<td>" + item.checkInvoice.invoiceType + "</td>" +
                            "<td>" + monitorStatusHTML + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>销方</td>" +
                            "<td colspan='3'>" + item.checkInvoice.salesName + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>购方</td>" +
                            "<td colspan='3'>" + item.checkInvoice.purchaserName + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>金额</td>" +
                            "<td colspan='3'>¥" + item.checkInvoice.amountTax + "</td>" +
                            "</tr>" +
                            "</table>" +
                            "<div class='info-ok'><i class='iconfont " + checkStatus + "'></i></div>" +
                            "<a href='/wechat/src/pages/assetsInfo.html?invoiceAssetId=" + item.checkInvoice.invoiceAssetId + "&searchParams=" + JSON.stringify(_this.params) + "' class='ticket-info'>" +
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

                _this.params.page ++;
                _this.query();
            }
        });
    }
};

+(function(){
    assetsList.init();
})();