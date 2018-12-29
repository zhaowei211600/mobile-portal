/*消息通知*/
var messageList = {
    init: function(){
        this.params = {};
        this.loadOK = false;
        this.initParams();
        this.common();
        this.searchLayer();
        this.query();
        this.loadMore();
    },
    initParams: function(){
        this.params.pageNo = 1;
        this.params.pageSize = 10;
        this.params.type = "1"; // 系统信息
        this.params.state = "0";   // 未读信息
    },
    common: function(){
        var _this = this;
        $(".risk-list .data-empty").hide();
        // 切换 tab 获取读取状态
        $(".risk-deal .deal").click(function(){
            $(this).addClass("on").siblings().removeClass("on");
            $(".risk-list ul").empty();
            _this.params.state = $(this).attr("data-state");
            _this.query();
        })
        // 弹层搜索 获取消息类型
        $(".search-body .layer-msg").click(function(){
            $(this).addClass("on").siblings().removeClass("on");
            $(".risk-list ul").empty();
            _this.params.type = $(this).attr("data-type");
            _this.query();
            $(".search-body").hide();
        })

        // 点击未读改为已读， 并进行后台处理
        $(".message-info ul").on("click", ".info", function(){
            if($(this).find(".iconfont").hasClass("icon-weidu")){
                var _this = this;
                var id = $(this).parents("li").attr("data-id");
                $.ajax({
                    url: BASEURL + "/message/update",
                    type: "post",
                    data: JSON.stringify({'messageId': id, 'state': '1'}),
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        if(data.returnCode == "200"){
                            $(_this).find(".iconfont").removeClass("icon-weidu").addClass("icon-yidu");
                        }else{
                            console.log(data.returnMessage);
                        }
                    }
                })
            }
        });
    },
    // 打开弹层
    searchLayer: function(){
        $(".top-search .search-bar .s-btn").click(function(){
            $(".search-body").show();
        })
        $(".top-search .search-body .layer-close").click(function(){
            $(".search-body").hide();
        })
    },
    // 列表查询
    query: function(){
        var _this = this;
        $.ajax({
            url: BASEURL + "/message/selection",
            type: "post",
            data: JSON.stringify(_this.params),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function(data){
                var mapData = [];
                if(data.returnCode == "200"){
                    var dataHTML = "";
                    var title = "";
                    var state = "";
                    mapData = data.data.messages;

                    // 滚动获取数据， 先隐藏空数据处理情况
                    $(".risk-list .data-empty").hide();

                    // 添加列表, 依次添加每一行
                    mapData.forEach(function(item, index, array){
                        switch (item.state){
                            case "0":
                                state = "icon-weidu";
                                break;
                            case "1":
                                state = "icon-yidu";
                                break;
                            default:
                                state = "icon-weidu";
                        }
                        dataHTML +=
                            "<li data-id='" + item.id + "'>" +
                                "<div class='datetime'>" +
                                    "<span class='b-time'>" + item.createTime.replace(/-/g, ".").replace(" ", "&nbsp;&nbsp;&nbsp;") + "</span>" +
                                "</div>" +
                                "<div class='info'>" +
                                    "<div class='s-info'>" +
                                        "<span class='t1'>" + item.title + "</span>" +
                                        "<span class='t4'><i class='iconfont " + state + "'></i></span>" +
                                    "</div>" +
                                    "<div class='more-info'>" +
                                        "<div class='info-txt'>" + item.content + "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</li>"
                    });


                    $(".content-body .risk-list ul").append(dataHTML);
                    // 判断 是否执行加载
                    if($(".content-body .risk-list ul").children().length < data.data.total){
                        $(".load-more").text("加载更多");
                        _this.loadOK = true;
                    }else{
                        $(".load-more").text("没有更多");
                    }
                }

                // 空数据处理 ：当数据获取空，并且当前显示列表页面中没任何数据， 说明 根本没数据.
                if(mapData.length <= 0 && $(".content-body .risk-list ul").children().length<=0 ){
                    $(".load-more").text("");
                    $(".risk-list ul").empty();
                    $(".risk-list .data-empty").show();
                }

            }
        })
    },
    // 加载更多
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
    messageList.init();
})();