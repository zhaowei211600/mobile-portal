function getAccount() {
    $.ajax({
        type: "post",
        url: BASEURL + '/user/info',
        data: '',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        async: true,
        crossDomain: true == !(document.all),
        // beforeSend: function(request) {
        // 	request.setRequestHeader("Authorization", tokenString);
        // },
        success: function (data) {
            $('.loadingBlue').remove()
            // console.log(data);
            var infoData = data.data
            if (data.returnCode == '200') {
                $('#phone').text(infoData.phone);
                /*if (infoData.state == 4) {
                    $('.wrap-top-dy').show();
                    $('.main_top_org').hide();
                    $('.red-prompt').hide();
                    $('.userCenter-authentication').text(infoData.orgName).css({"color":"#495060"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplySuccess.html";
                    });
                    $("#assetsTransfer").click(function () {
                        window.location.href = "/wechat/src/pages/assetsTransfer.html";
                    });
                }else if (infoData.state == 1 || infoData.state == 2) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("未认证").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApply.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }else if (infoData.state ==3) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("认证中").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplyNext.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }else if (infoData.state == 5) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("认证失败").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplyFail.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }else if (infoData.state == 6) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("已冻结").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplyFail.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                } else {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("注销").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApply.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }*/

            } else {
                // alert(data.returnMessage)
            }
        }
    });
}
loadingBlue()
getAccount();


//点击事件
$(function () {

    if(!$.cookie('Authorization')){
        greenAlertBox("未登录，需登录后查看");
        setTimeout("window.location.href = '../pages/login.html'", 1500);
    }else{
        $("#myWallet").click(function () {
            window.location.href = "../pages/myWallet.html";
        });
        $("#changePassword").click(function () {
            window.location.href = "../pages/changePassword.html";
        });
        $("#myOrder").click(function () {
            window.location.href = "../pages/myOrder.html";
        });
        $(".wrap-btn-quit").click(function () {
            loadingBlue()
            exitSystem();
        });
    }

    $.ajax({
        url: BASEURL + "/order/stat",
        type: "post",
        crossDomain: true == !(document.all),
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    $("#totalCount").html("("+resultData.data.totalCount+")");
                    $("#finishAmount").html("¥"+resultData.data.finishAmount);
                }
            }
            return false;
        },
        complete: function () {
        }
    });

});