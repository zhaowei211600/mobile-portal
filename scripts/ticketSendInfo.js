/*资产详情*/
var assetsInfo = {
    init: function(){
        this.params = {};
        this.addParams = [];
        this.initParams();
        this.common();
        this.query();
    },
    initParams: function(){
        this.params.page = 1;
        this.params.pageSize = 1;
        this.params.invoiceAssetId = "";
    },
    common: function(){
        var _this = this;
        var urlParams = window.location.search.substr(1).split("&");
        var backParams = JSON.parse(decodeURI(urlParams[1].split("=")[1]));// 返回时的参数，保证返回到之前正确的搜索页面
        backParams.page = 1;
        this.params.invoiceAssetId = decodeURI(urlParams[0].split("=")[1]);

        // 发送邮件监控
        $(".ticket-check-abled").click(function(){
            $(".ticket-check").removeClass("ticket-check-abled");
            var selectList = [];
            $(".data-list li").each(function(index, elem){
                selectList.push({
                    invoiceCode: $(this).attr("data-invoiceCode"),
                    invoiceNumber: $(this).attr("data-invoiceNumber")
                });
            });
            $(this).children(".real-same").html("发送中...");
            _this.sendEamil(selectList);
        })

        // 返回
        $(".s-back").click(function(event){
            event.preventDefault();
            console.log();
            window.location.href = $(".s-back").attr("href") + "?searchParams=" + JSON.stringify(backParams);
        });

    },
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
                                monitorStatus = "<div class='tips'>未监控</div>"/* +
                                    "<div class='add-monitor'>加入监控</div>"*/;
                                break;
                            default:
                                monitorStatus = "<div class='tips'>未监控</div>"
                                    /*+ "<div class='add-monitor'>加入监控</div>"*/;
                        }

                        dataHTML +=
                            "<li data-invoiceCode='" + item.checkInvoice.invoiceCode + "' data-invoiceNumber='" + item.checkInvoice.invoiceNumber + "'>" +
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

                    // 发票关键 请求
                    var detailParam = {
                        invoiceCode : mapData[0].checkInvoice.invoiceCode,
                        invoiceNumber : mapData[0].checkInvoice.invoiceNumber
                    };
                    _this.detailLayer(detailParam);
                }
            }
        });
    },
    // 发送邮件ajax
    sendEamil: function(selectList){
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
                    $(".ticket-check .real-same").html("发送邮件");
                    $(".ticket-check").addClass("ticket-check-abled");
                }
                else if(data.returnCode == "500"){
                    greenAlertBox("票据推送失败：未配置邮箱");
                    $(".ticket-check .real-same").html("发送邮件");
                    $(".ticket-check").addClass("ticket-check-abled");
                    console.log(data.returnMessage);
                }else{
                    greenAlertBox("票据推送失败：" + data.returnMessage);
                    $(".ticket-check .real-same").html("发送邮件");
                    $(".ticket-check").addClass("ticket-check-abled");
                }
            }
        })
    },
    // 详情弹层ajax
    detailLayer: function(detailParam){
        $.ajax({
            url : BASEURL + "/invoice/querySingleInvoice",
            data: JSON.stringify(detailParam),
            dataType: "json",
            contentType: "application/json",
            type: "post",
            success: function(data){
                if(data.returnCode == "200"){
                    // invoiceDetail(data.data);
                    // goodsData=data.data;
	                invoiceShell = data.data.checkInvoice;
	                invoiceDetailShell(invoiceShell.invoiceTypeCode);
	                setTimeout(function () {
		                $.isFunction(invoiceDetail) && invoiceDetail(invoiceShell);
	                },50)
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
	                },55)
                    // switch (data.data.checkResult) {
                    //     case '1':
                    //         $('.invoice-detail .yinzhang .iconfont').removeClass("icon-yinzhang").addClass("icon-gaizhangyushijiyizhi").show();
                    //         // $("#invoice-info").html("票面信息与实际一致");
                    //         break;
                    //     case '2':
                    //         $('.invoice-detail .yinzhang .iconfont').removeClass("icon-gaizhangyushijiyizhi").addClass("icon-yinzhang").show();
                    //         // $("#invoice-info").html("票面信息与实际不符");
                    //         break;
                    //     default:
                    //         $('.invoice-detail .yinzhang').hide();
                    //         break;
                    // }
                }
            }
        });
    }
};

+(function(){
    assetsInfo.init();
})()