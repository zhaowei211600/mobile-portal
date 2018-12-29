//扫码核验
var assetPool = {
    init: function () {
        this.checking();
        $('.loadingBlue').remove()
    },
    checking: function () {
        var requestUrl = location.href.split('#')[0];
        // alert(requestUrl);
        var _readyListenner = false;
        var nonceStr;
        var signature;
        var timestamp;
        // var res = {
        //     "resultStr":"01,10,012001700211,02402683,81.80,20171212,11460732872383662325,9CA0,",
        //     "errMsg":"sacnQRCode:ok"
        // };
        $.ajax({
            type: "post",
            // url:"http://zhaowei.ittun.com/wpp/ticket",
            url: BASEURL + "/mobile/wpp/ticket",
            data:{"requestUrl":requestUrl},
            contentType:"application/x-www-form-urlencoded",
            success: function (data) {
                if (data.returnCode == '200') {
                    nonceStr = data.data.nonceStr;
                    signature = data.data.signature;
                    timestamp = data.data.timestamp;
                    appId = data.data.appId;
                    wx.config({
                        debug: false,
                        appId: appId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        beta: true,
                        jsApiList: [
                            'scanQRCode'
                        ]
                    });
                    //判断认证状态
                    getUserInfo(function (resp) {
                        if (resp.returnCode == '200') {
                            var approveState = resp.data.state;
                            // console.log(approveState);
                            if (approveState == 4) {
                                $('.main_top_org').hide();
                                document.querySelector('#scan_button').onclick = function () {
                                    //清楚本地缓存
                                    sessionStorage.removeItem("data");
                                    wx.scanQRCode({
                                        needResult: 1,
                                        desc: 'scanQRCode desc',
                                        success: function (res) {
                                            // alert(res);
                                            loadingBlue();
                                            var scanVal =  res.resultStr;
                                            var codeArr = scanVal.split(',') || scanVal.split('，');
                                            // alert(codeArr);
                                            // alert(scanVal);
                                            if (codeArr.length == 0) return;
                                            //判断金额或者校验码
                                            if (codeArr.length > 4) {
                                                if (codeArr[5]){
                                                    billingDateVal = codeArr[5].substr(0, 4) + '-' + codeArr[5].substr(4, 2) + '-' + codeArr[5].substr(6, 2);
                                                    codeList = codeArr[2];
                                                    invoiceNumVal = codeArr[3];
                                                    CheckCodeVal = codeArr[6].substr(codeArr[6].length - 6);
                                                    totalAmountVal = codeArr[4];
                                                    var params = {};
                                                    params['invoiceCode'] = codeList;
                                                    params['invoiceNumber'] = invoiceNumVal;
                                                    params['billingDate'] = billingDateVal;
                                                    params['totalAmount'] = totalAmountVal;
                                                    params['checkCode'] = CheckCodeVal;
	                                                checkInvoceType(codeList);

                                                }else {
                                                    // billingDateVal = ''
                                                    codeList = codeArr[2];
                                                    invoiceNumVal = codeArr[3];
                                                    window.sessionStorage.setItem("codeList",codeList);
                                                    window.sessionStorage.setItem("invoiceNumVal",invoiceNumVal)
                                                    // window.location.href = '/wechat/src/pages/check_fail_notFind.html';
                                                    window.location.href = '/wechat/src/pages/assetsCheck-manual.html';
                                                }
                                            }
                                        }
                                    });
                                };
                            } else {
                                document.querySelector('#scan_button').onclick = function () {
                                    $('.main_top_org').show();
                                    $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                                    // console.log('未认证，增加效果')
                                    setTimeout(function () {
                                        $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                                    }, 1000)
                                }
                            }
                        }
                    });
                }
            }
        });
        wx.ready(function () {
            _readyListenner = true;
        });
        wx.error(function (res) {
            alert(res.errMsg);
        });

        function switchje(num,params) {
            if (num == 1 || num == 3) {
                var data = {};
                data['invoiceCode'] = params['invoiceCode'];
                data['invoiceNumber'] = params['invoiceNumber'];
                data['billingDate'] = params['billingDate'];
                data['totalAmount'] = params['totalAmount'];
                check(data);
            } else if (num == 2) {
                var data = {};
                data['invoiceCode'] = params['invoiceCode'];
                data['invoiceNumber'] = params['invoiceNumber'];
                data['billingDate'] = params['billingDate'];
                data['checkCode'] = params['checkCode'];
                check(data);
            }
        }
        function check(params) {
            $.ajax({
                type: "post",
                url: BASEURL + "/invoice/check",
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    if (data.returnCode == 200) {
                        var obj = JSON.stringify(data.data);
                        sessionStorage.setItem("data",obj);
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
        // });
        $("#assets_details").click(function () {
            $("#details").css('display','block');
            $("#btn_shut").click(function () {
                $("#details").css('display','none');
            });
        });
    }
};
$(function () {
    assetPool.init();
    $('.loadingBlue').remove()
    $('#checkManual').click(function () {
        window.sessionStorage.removeItem("codeList");
        window.sessionStorage.removeItem("invoiceNumVal");
        window.location.href="/wechat/src/pages/assetsCheck-manual.html"
    })

});