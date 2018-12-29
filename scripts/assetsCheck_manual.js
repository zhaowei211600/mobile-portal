//测试数据普票：
// $('#invoiceCodeVal').val('012001700211')
// $('#invoiceNumVal').val('02402683')
// $('#totalAmountVal').val('84.25')
// $('#CheckCodeVal').val('662325')
// $('#billingDateVal').val('2017-12-12')

//测试数据专票：
// $('#invoiceCodeVal').val('3400164130')
// $('#invoiceNumVal').val('00660381')
// $('#totalAmountVal').val('1809.44')
// $('#CheckCodeVal').val('')
// $('#billingDateVal').val('2017-10-13')

//手动录入
var assetPool = {
    initPool: function () {
        this.checking();
    },
    checking: function () {
        //时间框赋值
        var billingDate1;
        billingDate1 = $('#billingDateVal').val();
        if ($("#invoiceCodeVal").val()){
            // console.log(billingDate1);
            var codeList = $("#invoiceCodeVal").val().split("");
            $("#invoice_date_input").text(billingDate1);
            // console.log($("#invoice_date_input").text() != "请输入开票日期")
            if ($("#invoice_date_input").text() != "请输入开票日期"){
                $("#invoice_date_input").css('color','#1C2438');
            }
        }
        //监控时间输入框值的改变
        $('#billingDateVal').bind('input propertychange', function() {
            billingDate1  = $('#billingDateVal').val();
            // console.log(billingDate1)
            $("#invoice_date_input").css('color','#1C2438');
            $("#invoice_date_input").text(billingDate1);
            if (billingDate1 == null){
                $("#invoice_date_input").css('color','#BBBBBB');
                $("#invoice_date_input").text("请输入开票日期");
            }
        });
        //判断认证状态
        getUserInfo(function (resp) {
            if (resp.returnCode == '200') {
                var approveState = resp.data.state;
                // console.log(approveState);
                if (approveState == 4) {
                    $('.main_top_org').hide();
                    //监听失去焦点验证
                    $('#invoiceCodeVal').blur(function () {
                        // console.log(1)
                        checks(1);
                    });
                    $('#invoiceNumVal').blur(function () {
                        // console.log(1)
                        checks(2);
                    });
                    $('#totalAmountVal').blur(function () {
                        checks(3);
                    });
                    $('#CheckCodeVal').blur(function () {
                        checks(4);
                    });
                    $('#billingDateVal').blur(function () {
                        checks(5);
                    });
                    //核验按钮
                    $('#check_btn').click(function () {
                        //清楚本地缓存
                        sessionStorage.removeItem("data");
                        //验证输入格式
                        if (verifyValues() != false) {
                            loadingBlue();
                            var params = {};
                            params['invoiceCode'] = invoiceCode;
                            params['invoiceNumber'] = invoiceNumber;
                            params['billingDate'] = issueDate;
                            params['totalAmount'] = invoiceAmount;
                            params['checkCode'] = invoiceCheckcode;
                            // console.log(params)
                            //发送查验请求
                            check(params)
                        }
                    });
                }else {
                    $('#check_btn').click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }
            }
        });
        //核验
        function check(params) {
            $.ajax({
                type: "post",
                url: BASEURL + "/invoice/check",
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    window.sessionStorage.removeItem("codeList");
                    window.sessionStorage.removeItem("invoiceNumVal");
                    if (data.returnCode == 200) {
                        var obj = JSON.stringify(data.data);
                        sessionStorage.setItem("data",obj);
                        // alert(sessionStorage.getItem("data"))
                        window.location.href = '/wechat/src/pages/check_success.html';
                        $(".loadingBlue").remove();
                    }
                    else {
                        window.location.href = '/wechat/src/pages/check_fail_notFind.html';
                        $(".loadingBlue").remove();
                    }
                },
                error: function (data) {
                    window.location.href = '/wechat/src/pages/check_fail_abnormal.html';
                    $(".loadingBlue").remove();
                }
            });
        }
    }
};
$(function () {
   assetPool.initPool();
    $("#invoiceCodeVal").val(window.sessionStorage.getItem("codeList"));
    $("#invoiceNumVal").val(window.sessionStorage.getItem("invoiceNumVal"));
});