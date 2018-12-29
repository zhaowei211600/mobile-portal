/*****票据推送*****/
var ticketSend = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.selectList = [];
        this.initParams();
        this.common();
        this.query();
        this.select();
        this.searchLayer();
        this.loadMore();
    },
    initParams: function(){
        this.params.page = 1;
        this.params.pageSize = 10;
        this.params.sendStatus = "";
        this.params.salesName = "";
        this.params.invoiceCode = "";
        this.params.invoiceNumber = "";
    },
    common: function(){
        // 当页面是从票据推送详情页面返回时， 保存之前的搜索信息
        var urlParams = "";
        if(window.location.search.substr(1).split("=")[1]) {
            urlParams = JSON.parse(decodeURI(window.location.search.substr(1).split("=")[1]));
            this.params = urlParams;
        }
    },
    // 显示列表
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
                        $(".content-wrap .content-body").show();
                        $(".content-wrap .data-empty").hide();
                        var dataHTML = "";
                        var emailStatus = "";
                        console.log(mapData);
                        // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                        mapData.forEach(function (item, index, array) {
                            emailStatus = item.sendStatus == "1" ? "email-ok" : "email-no";
                            dataHTML +=
                                "<li data-select='false' data-invoiceCode='" + item.checkInvoice.invoiceCode + "' data-invoiceNumber='" + item.checkInvoice.invoiceNumber + "'>" +
                                "<div class='is-email " + emailStatus + "'><span></span></div> " +
                                "<div class='email-choose'><i class='iconfont icon-weixuanzhong'></i></div>" +
                                "<table>" +
                                "<tr class='standard'>" +
                                "<td>日期</td>" +
                                "<td>" + item.checkDate.split(" ")[0] + "</td>" +
                                "<td>" + item.checkInvoice.invoiceType + "</td>" +
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
                                "<a href='/wechat/src/pages/ticketSendInfo.html?invoiceAssetId=" + item.checkInvoice.invoiceAssetId + "&searchParams=" + JSON.stringify(_this.params) + "' class='ticket-info'>" +
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
    // 选中按钮 处理情况
    select: function(){
        var _this = this;
        var  email_select = false;  //  列表li的data-select 属性， 判断是否选中该列
        $(".tickets-send ul").on("click", ".email-choose", function(){
            _this.selectList = [];
            email_select = $(this).parent("li").attr("data-select") == "true" ? false : true;
            $(this).parent("li").attr("data-select",email_select);
            if(email_select){
                $(this).children("i").removeClass("icon-weixuanzhong").addClass("icon-yixuanzhong");
            }else{
                $(this).children("i").removeClass("icon-yixuanzhong").addClass("icon-weixuanzhong");
            }
            $(".tickets-send ul li").each(function(index, elem){
                $(this).attr("data-select") == "true" ?
                    _this.selectList.push({
                        invoiceCode: $(this).attr("data-invoiceCode"),
                        invoiceNumber: $(this).attr("data-invoiceNumber")
                    }) : "" ;
            });
            _this.selectList.length >= 1 ?
                $(".content-body .email-send").addClass("choose-email") :
                $(".content-body .email-send").removeClass("choose-email")

        });
        // 点击发送邮件
        $(".email-send").click(function(){
            if(_this.selectList.length >= 1){
                _this.sendEamil(_this.selectList);
            }
        })
    },
    // 发送邮件ajax
    sendEamil: function(selectList){
        var _this = this;
        console.log(selectList);
        $.ajax({
            url: BASEURL + "/invoice/send_invoice_email",
            data: JSON.stringify(selectList),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data.returnCode == "200") {
                    greenAlertBox("票据推送成功");
                    var email_select = false;
                    $(".tickets-send ul li").each(function(index, elem){
                        _this.selectList = [];
                        if($(this).attr("data-select") == "true"){
                            //  取消选中
                            email_select = $(this).attr("data-select") == "true" ? false : true;
                            $(this).attr("data-select",email_select);
                            if(email_select){
                                $(this).find(".email-choose i").removeClass("icon-weixuanzhong").addClass("icon-yixuanzhong");
                            }else{
                                $(this).find(".email-choose i").removeClass("icon-yixuanzhong").addClass("icon-weixuanzhong");
                            }
                            // 该变未已发送
                            $(this).find(".is-email").removeClass("eamil-no").addClass("email-ok");
                            // 将发送按钮 置回原样
                            $(".email-send").removeClass("choose-email");
                        }
                    });
                    console.log(data.returnMessage);
                }else if(data.returnCode == "500"){
                    greenAlertBox("票据推送失败：未配置邮箱");
                    console.log(data.returnMessage);
                }else{
                    greenAlertBox("票据推送失败：" + data.returnMessage);
                }
            }
        })
    },
    // 打开搜索弹层
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

        // 重置
        $(".reset").click(_this.resetLayer);

        // 确认
        $(".submit").click(function(){
            // 先重置参数
            _this.initParams();

            _this.params.sendStatus = $(".email-status .layer-btn-es a").hasClass("on") ? $(".email-status .layer-btn-es .on").attr("data-sendStatus") : "";
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
    ticketSend.init();
})()