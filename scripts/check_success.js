//核验成功
var hy_num, jk_num, hy_data, jk_data, ok = 0, checkResult;
var assetPool = {
    initPool: function () {
        this.invoiceInfo();
    },
    invoiceInfo: function () {
        //拿到缓存的发票数据
        var data = JSON.parse(sessionStorage.getItem("data"));
        // console.log(data);
        //填写票面信息
       setTimeout(function () {
           //invoiceDetail(data);
           //清单列表
           //goodsData = data;

           invoiceShell = data;
           invoiceDetailShell(invoiceShell.invoiceTypeCode);
           setTimeout(function () {
               $.isFunction(invoiceDetail) && invoiceDetail(invoiceShell);
           },100)
           // goodsData = data.data;
           setTimeout(function () {
               switch (data.checkResult) {
                   case '1':
                       $('.check_result_icon').show();
                       // $("#invoice-info").html("票面信息与实际一致");
                       break;
                   default:
                       $('.check_result_icon').hide();
                       // $("#invoice-info").html("票面信息与实际不符");
                       break;
               }
           },110)

           //清空清单
           clearListDetail();
           // console.log(goodsData)
           //添加清单数据
           // saleListDetail(goodsData);
       },0)
        // //清单列表
        // goodsData = data;
        // //清空清单
        // clearListDetail();
        // // console.log(goodsData)
        // //添加清单数据
        // saleListDetail(goodsData);
        //清空轨迹
        $("#hy_list").empty();
        $("#jk_list").empty();
        //核验轨迹
        hyrecord(data);
        //监控轨迹
        jkrecord(data);
        //核验轨迹函数
        function hyrecord(item) {
            var hy_num1;
            var params = {
                invoiceCode: item.invoiceCode,
                invoiceNumber: item.invoiceNumber
            };
            $.ajax({
                url: BASEURL + "/invoice//user/check_count_by_org",
                data: JSON.stringify(params),
                type: "post",
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    switch (data.returnCode) {
                        case '200':
                            hy_data = data.data;
                            hy_num = data.data.length;
                            hy_num1 = data.total;
                            break;
                        default:
                            hy_data = [];
                            hy_num = 0;
                            hy_num1 = 0;
                            break;
                    }
                    ok += 1;
                    if (ok == 2) {
                        var gj_num, a = 0, b = 0;
                        // gj_num = hy_num + jk_num;
                        // $("#gj-record").html(gj_num);
                        // console.log(hy_num);
                        // console.log(jk_num);
                        if (hy_num <= 2 && jk_num <= 2) {
                            a = hy_num;
                            b = jk_num;
                        } else if (hy_num <= 2 && jk_num > 2) {
                            a = hy_num;
                            b = b <= (4 - a) ? jk_num : (4 - a);
                        } else if (hy_num > 2 && jk_num <= 2) {
                            b = jk_num;
                            a = a <= (4 - b) ? (4 - b) : hy_num;
                            // console.log(a);
                            // console.log(b);
                        } else {
                            a = 2;
                            b = 2;
                        }
                        // console.log(1);
                        //动态添加核验轨迹详情
                        for (var i = 0; i < a; i++) {
                            $("#hy_list").append("<li><p class='check_result_right_list_num'>" + hy_data[i].abnormalMessage + "</p></li>");
                            // console.log(a);
                            // console.log(b);
                        }
                        for (var j = 0; j < b; j++) {
                            $("#jk_list").append("<li><p class='check_result_right_list_num'>" + jk_data[j].abnormalMessage + "</p></li>");
                        }
                    }
                    switch (data.returnCode) {
                        case '200':
                            // hy_num = data.data.length;
                            hy_num1 = data.total;
                            break;
                        default:
                            // hy_num = 0;
                            hy_num1 = 0;
                            break;
                    }
                    //动态添加核验总数
                    $("#hy-record").html(hy_num1);
                    // $("#hy-record1").html(hy_num1);
                    // ok = 0;7
                    //轨迹详情
                    $("#icon-xiajiantou1").click(function () {
                        //判断轨迹详情收起与展示
                        if ($(this).hasClass("icon-xiajiantou")){
                            $(this).addClass("icon-shangjiantou").removeClass("icon-xiajiantou");
                            $("#hy_list").css('display','block');
                            $("#check_record_total").css('border-bottom','3px solid #E9EAEC');
                            $("#check_record").css('margin-bottom','3rem');
                            $("#monitoring_record").css('border-top','3px solid #E9EAEC');
                        }else {
                            $(this).addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
                            $("#hy_list").css('display','none');
                            $("#check_record_total").css('border-bottom','none');
                            $("#check_record").css('margin-bottom','0');
                            $("#monitoring_record").css('border-top','none');
                        }
                    });
                }
            });
        }
        //监控轨迹函数
        function jkrecord(item) {
            // var invoiceAssetId = item.invoiceAssetId;
            var jk_num1;
            var params = {
                invoiceCode: item.invoiceCode,
                invoiceNumber: item.invoiceNumber
            };
            $.ajax({
                url: BASEURL + "/invoice//user/monitor_count_by_org",
                data: JSON.stringify(params),
                type: "post",
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    switch (data.returnCode) {
                        case '200':
                            jk_data = data.data;
                            jk_num = data.data.length;
                            jk_num1 = data.total;
                            break;
                        default:
                            jk_data = [];
                            jk_num = 0;
                            jk_num1 = 0;
                            break;
                    }           // console.log(data);
                    ok += 1;
                    // console.log(data.data.length);
                    if (ok == 2) {
                        // console.log(ok);
                        // console.log(hy_num);
                        // console.log(jk_num);
                        var gj_num, a = 0, b = 0;
                        // gj_num = hy_num + jk_num;
                        // $("#gj-record").html(gj_num);
                        if (hy_num <= 2 && jk_num <= 2) {
                            a = hy_num;
                            b = jk_num;
                        } else if (hy_num <= 2 && jk_num > 2) {
                            a = hy_num;
                            b = b <= (4 - a) ? jk_num : (4 - a);
                        } else if (hy_num > 2 && jk_num <= 2) {
                            b = jk_num;
                            a = a <= (4 - b) ? (4 - b) : hy_num;
                            // console.log(a);
                            // console.log(b);
                        } else {
                            a = 2;
                            b = 2;
                        }
                        // console.log(a);
                        // console.log(b);
                        //动态添加核验轨迹详情
                        for (var i = 0; i < a; i++) {
                            $("#hy_list").append("<li><p class='check_result_right_list_num'>" + hy_data[i].abnormalMessage + "</p></li>");
                            // console.log(a);
                            // console.log(b);
                        }
                        for (var j = 0; j < b; j++) {
                            $("#jk_list").append("<li><p class='check_result_right_list_num'>" + jk_data[j].abnormalMessage + "</p></li>");
                        }
                    }
                    switch (data.returnCode) {
                        case '200':
                            // jk_num = data.data.length;
                            jk_num1 = data.total;
                            break;
                        default:
                            // jk_num = 0;
                            jk_num1 = 0;
                            break;
                    }
                    $("#jk-record").html(jk_num1);
                    // $("#jk-record1").html(jk_num1);
                    $("#icon-xiajiantou2").click(function () {
                        if ($(this).hasClass("icon-xiajiantou")){
                            $(this).addClass("icon-shangjiantou").removeClass("icon-xiajiantou");
                            $("#jk_list").css('display','block');
                            $("#monitoring_record_total").css('border-bottom','3px solid #E9EAEC');
                        }else {
                            $(this).addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
                            $("#jk_list").css('display','none');
                            $("#monitoring_record_total").css('border-bottom','none');
                        }
                    });
                }
            });
        }
        $("#check_btn").click(function () {
            //跳转扫码核验
            window.location.href = '/wechat/src/pages/assetsCheck-scan.html';
        });
    }
};
$(function () {
    assetPool.initPool();

});