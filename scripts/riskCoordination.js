// 风险协同
var riskCoodination = {
    init: function(){
        this.ajaxParams = {};
        this.loadOK = false;
        this.initParams();
        this.common();
        this.query();
        this.loadMore();
    },
    initParams: function(){
        this.ajaxParams.page = 1;
        this.ajaxParams.pageSize = 10;
        this.ajaxParams.invoiceAsssetId = "";
        this.ajaxParams.status = 1;
        this.ajaxParams.timeType = "1";
    },
    common: function(){
        var _this = this;
        $(".risk-list .data-empty").hide();

        // 打开关闭 隐藏信息
        /*$(".risk-list ul").find("li").each(function(index, elem){
            $(this).find(".s-info").click(function(){
                console.log(index);
                if ($(this).find(".iconfont").hasClass("icon-xiajiantou")){
                    $(this).find(".iconfont").addClass("icon-shangjiantou").removeClass("icon-xiajiantou");
                }else {
                    $(this).find(".iconfont").addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
                }
                $(this).find(".more-info").hasClass("show") ? $(this).find(".more-info").removeClass("show") :
                    $(this).find(".more-info").addClass("show");
            })
        });*/
        $(".risk-list ul").on("click", ".s-info", function(){
            if ($(this).find(".iconfont").hasClass("icon-xiajiantou")){
                $(this).find(".iconfont").addClass("icon-shangjiantou").removeClass("icon-xiajiantou");
            }else {
                $(this).find(".iconfont").addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
            }
            $(this).parents("li").find(".more-info").hasClass("show") ? $(this).parents("li").find(".more-info").removeClass("show") :
                $(this).parents("li").find(".more-info").addClass("show");
        });
        $(".risk-list ul").on("click", ".datetime", function(){
            if ($(this).parents("li").find(".s-info .iconfont").hasClass("icon-xiajiantou")){
                $(this).parents("li").find(".s-info .iconfont").addClass("icon-shangjiantou").removeClass("icon-xiajiantou");
            }else {
                $(this).parents("li").find(".s-info .iconfont").addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
            }
            $(this).parents("li").find(".more-info").hasClass("show") ? $(this).parents("li").find(".more-info").removeClass("show") :
                $(this).parents("li").find(".more-info").addClass("show");
        });

        // 切换 tab
        $(".risk-deal .deal").click(function(){
            $(this).addClass("on").siblings().removeClass("on");
            $(".risk-list ul").empty();
            _this.ajaxParams.status = $(this).attr("data-deal");
            _this.query();
        })

        // 操作 忽略-同意
        $(".risk-list ul").on("click", ".control a", function(){
            var _this = this;
            var status = $(this).attr("data-status");
            var id = $(this).parents("li").attr("data-id");
            $.ajax({
                url: BASEURL + "/asset/synergy/update?id=" + id + '&status=' + status,
                type: "post",
                contentType: "application/json",
                success: function (data) {
                    if(data.returnCode == "200"){
                        $(_this).parents("li").hide();   // 隐藏当前的操作按钮
                    }
                }
            });
        })
    },
    // 显示列表
    query: function(){
        var _this = this;
        // 查询
        $.ajax({
            url: BASEURL + "/asset/synergy/list",
            type: "post",
            data: JSON.stringify(_this.ajaxParams),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function(data){
                var mapData = [];
                if(data.returnCode == "200"){
                    var dataHTML = "";
                    var controlHTML = "";
                    var abnormalCode = "";
                    var orgName = "";
                    var time = "";
                    mapData = data.data;
                    $(".risk-list .data-empty").hide();

                    // 添加列表
                    mapData.forEach(function(item, index, array){
                        switch (item.abnormalCode){
                            case "0" :
                                abnormalCode = "状态改变";
                                break;
                            case "1" :
                                abnormalCode = "重复核验";
                                break;
                            case "2" :
                                abnormalCode = "重复监控";
                                break;
                        }
                        controlHTML = _this.ajaxParams.status == "1" ?
                                '<div class="control">\n' +
                                    '<a href="javascript: void(0);" class="ignore" data-status="3">忽略</a>' +
                                    '<a href="javascript: void(0);" class="agree" data-status="2">同意</a>' +
                                '</div>' : "";
                        orgName = !!item.orgName ? "<span class='t1'>[" + item.orgName + "]</span>" : "";

                        dataHTML +=
                            "<li data-id='" + item.id + "'>" +
                                "<div class='datetime'>" +
                                    "<span class='b-time'>" + item.communicationTime.replace(/-/g, ".").replace(" ", "&nbsp;&nbsp;&nbsp;") + "</span>" +
                                "</div>" +
                                "<div class='info'>" +
                                    "<div class='s-info'>" +
                                         orgName +
                                        "<span class='t2'>" + "协同申请" + "</span>" +
                                        "<span class='t4'><i class='iconfont icon-xiajiantou'></i></span>" +
                                        "<span class='t3'>" + abnormalCode + "</span>" +
                                    "</div>" +
                                    "<div class='more-info'>" +
                                        "<div class='info-txt'>" + item.communicationMessage + "</div>" +
                                        controlHTML +
                                    "</div>" +
                                "</div>" +
                            "</li>"
                    });

                    $(".content-body .risk-list ul").append(dataHTML);
                    // 判断 是否执行加载
                    if($(".content-body .risk-list ul").children().length < data.total){
                        $(".load-more").text("加载更多");
                        _this.loadOK = true;
                    }else{
                        $(".load-more").text("没有更多");
                    }
                }
                // 空数据 处理
                if(mapData.length <= 0 && $(".content-body .risk-list ul").children().length<=0 ){
                    $(".load-more").text("");
                    $(".risk-list ul").empty();
                    $(".risk-list .data-empty").show();
                }
            }
        });
    },
    // 加载更多
    loadMore: function(){
        var _this = this;
        $(window).scroll(function(){
            if(_this.loadOK && ($(this).scrollTop() + $(this).height()) >= $(".load-more").offset().top){
                _this.loadOK = false;

                _this.ajaxParams.page ++;
                _this.query();
            }
        });
    }
};

+(function(){
    riskCoodination.init();
})()
