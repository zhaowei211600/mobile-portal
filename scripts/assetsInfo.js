/*资产详情*/
var assetsInfo = {
    init: function(){
        this.params = {};
        this.addParams = [];
        this.detailParam = {}; // 发票请求信息
        this.initParams();
        this.common();
        this.query();
        this.ticketMap();
    },
    initParams: function(){
        this.params.page = 1;
        this.params.pageSize = 1;
        this.params.invoiceAssetId = "";
    },
    common: function(){
        var _this = this;
        var urlParams = window.location.search.substr(1).split("&");
        var backParams = JSON.parse(decodeURI(urlParams[1].split("=")[1]));// 返回时的参数
        backParams.page = 1;
        this.params.invoiceAssetId = decodeURI(urlParams[0].split("=")[1]);
        // 加入监控
        $(".add-monitor").on("click", function(){

            $.ajax({
                url: BASEURL + "/invoice/monitor/insert",
                data: JSON.stringify(_this.addParams),
                type: "post",
                dataType: "json",
                contentType: "application/json",
                success: function(data){
                    if(data.returnCode == "200") {
                        $(".add-monitor").hide();
                        $(".is-monitor .tips").text("已监控");
                    }else if (data.returnCode == "515"){
                        greenAlertBox(data.returnMessage);
                    }
                }
            })
        });

        // 返回
        $(".s-back").click(function(event){
           event.preventDefault();
           console.log();
           window.location.href = $(".s-back").attr("href") + "?searchParams=" + JSON.stringify(backParams);
        });
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
            success: function(data){
                var mapData = [];
                if(data.returnCode == "200"){
                    mapData = data.data;
                    var dataHTML = "";
                    var monitorStatus = "";
                    _this.addParams.push({
                        invoiceAssetId : mapData[0].checkInvoice.invoiceAssetId,
                        invoiceCode: mapData[0].checkInvoice.invoiceCode,
                        invoiceNumber: mapData[0].checkInvoice.invoiceNumber,
                        invoiceType: mapData[0].checkInvoice.invoiceTypeCode
                    });
                    // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                    mapData.forEach(function (item, index, array) {
                        switch (item.monitorStatus) {
                            case "0" :
                            case "2" :
                                monitorStatus = "<div class='tips'>已监控</div>";
                                break;
                            case "1" :
                            case "3" :
                                monitorStatus = "<div class='tips'>未加入</div>" +
                                                "<div class='add-monitor'>加入监控</div>";
                                break;
                            default:
                                monitorStatus = "<div class='tips'>未加入</div>" +
                                                "<a class='add-monitor'>加入监控</a>";
                        }

                        dataHTML +=
                            "<li>" +
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
                            "<div class='is-monitor'>" + monitorStatus + "</div>" +
                            "</li>";
                    });
                    $(".content-body > ul").append(dataHTML);
                    // 加入监控
                    $(".add-monitor").click(function(){
                        $.ajax({
                            url: BASEURL + "/invoice/monitor/insert",
                            data: JSON.stringify(_this.addParams),
                            type: "post",
                            dataType: "json",
                            contentType: "application/json",
                            success: function(data){
                                if(data.returnCode == "200") {
                                    $(".add-monitor").hide();
                                    $(".is-monitor .tips").text("已监控");
                                }else if (data.returnCode == "515"){
                                    greenAlertBox(data.returnMessage);
                                }
                            }
                        })
                    });
                    // 发票关键 请求
                    _this.detailParam = {
                        invoiceCode : mapData[0].checkInvoice.invoiceCode,
                        invoiceNumber : mapData[0].checkInvoice.invoiceNumber
                    };
                    _this.detailLayer();
                }
            }
        });
    },
    // 详情弹层ajax
    detailLayer: function(){
        var _this = this;
        $.ajax({
            url : BASEURL + "/invoice/querySingleInvoice",
            data: JSON.stringify(_this.detailParam),
            dataType: "json",
            contentType: "application/json",
            type: "post",
            success: function(data){
                if(data.returnCode == "200"){
                    // invoiceDetail(data.data);
                    // goodsData = data.data;
	                invoiceShell = data.data.checkInvoice;
	                invoiceDetailShell(invoiceShell.invoiceTypeCode);
	                setTimeout(function () {
		                $.isFunction(invoiceDetail) && invoiceDetail(invoiceShell);
	                },100)
	                // goodsData = data.data;
	                setTimeout(function () {
		                switch (data.data.checkResult) {
                            case '1':
                                // $('.check_result_icon').removeClass("icon-yinzhang").addClass("icon-gaizhangyushijiyizhi").show();
                                $('.check_result_icon').removeClass("icon-gaizhangyushijiyizhi").addClass("icon-yinzhang").show();
                                // $("#invoice-info").html("票面信息与实际一致");
                                break;
                            case '2':
                                // $('.check_result_icon').removeClass("icon-gaizhangyushijiyizhi").addClass("icon-yinzhang").show();
                                $('.check_result_icon').removeClass("icon-yinzhang").addClass("icon-gaizhangyushijiyizhi").show();
                                // $("#invoice-info").html("票面信息与实际不符");
                                break;
                            default:
                                $('.check_result_icon').hide();
                                break;
		                }
	                },110)
                    //清空清单
                    // clearListDetail();
                    // // console.log(goodsData)
                    // //添加清单数据
                    // saleListDetail(goodsData);
                    switch (data.data.checkResult) {
                        case '1':
                            $('.check_result_icon').addClass("icon-yinzhang").removeClass("icon-gaizhangyushijiyizhi");
                            $('.check_result_icon').show();
                            $('.check_result_icon').attr("data-show", "1");
                            // $("#invoice-info").html("票面信息与实际一致");
                            break;
                        case '0':
                            $('.check_result_icon').hide();
                            $('.check_result_icon').attr("data-show", "0");
                            //为核验
                            break;
                        default:
                            $('.check_result_icon').addClass("icon-gaizhangyushijiyizhi").removeClass("icon-yinzhang");
                            $('.check_result_icon').show();
                            $('.check_result_icon').attr("data-show", "2");
                            // $("#invoice-info").html("票面信息与实际不符");
                            break;
                    }
                }
            }
        });
    },
    // 发票操作
    ticketMap: function(){
        var _this = this;

        $(".ticket-check a").click(function(){
            var checkResult = $(this).attr("data-checkResult");
            var show = $('.check_result_icon').attr("data-show");
            $(this).addClass("on").siblings().removeClass("on");
            //  页面印章显示状态 与 按钮描述信息不一样
            if(show != checkResult ) {
                _this.detailParam.checkResult = checkResult;
                $.ajax({
                    url: BASEURL + "/invoice/updateCheckStatus",
                    data: JSON.stringify(_this.detailParam),
                    dataType: "json",
                    contentType: "application/json",
                    type: "post",
                    success: function (data) {
                        if (data.returnCode == "200") {
                            // 修改 成对应状态
                            $('.check_result_icon').attr("data-show", checkResult);
                            if (checkResult == "1") {
                                $('.check_result_icon').addClass("icon-yinzhang").removeClass("icon-gaizhangyushijiyizhi");
                                $('.check_result_icon').show();
                            } else if (checkResult == "2"){
                                $('.check_result_icon').addClass("icon-gaizhangyushijiyizhi").removeClass("icon-yinzhang");
                                $('.check_result_icon').show();
                            }
                        }
                        else {
                            console.log(data.returnMessage);
                        }
                    }
                });
            }
        })
    }
};

+(function(){
    assetsInfo.init();
})()