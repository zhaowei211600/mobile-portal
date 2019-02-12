//通用环境
//var BASEURL = 'http://127.0.0.1:10002';
//var BASEURL = 'http://39.106.157.230:10002';
//var BASEURL = 'http://118.190.146.125:10002';
var BASEURL = 'http://zhaobangshou.com.cn/backmobile';



var code;
// var tokenString = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6NjMsImV4cCI6MTUxNzk3NDA4NCwic3ViIjoiMTUwMDEwOTQzMjAiLCJleHBpcmVkIjoxNTE3OTc0MDg0MjY1LCJjcmVhdGVkIjoxNTE3OTcwNDg0MjY1fQ.NuZX9SSaqVZPiSFyT4RkunaT3HUEDT6vIZ7vIhu6PfOt4w2m74Sq7gZaThoT-7ZoavdCkMjPKdVr_xhhk98nIw";
var tokenString = getTokenString();
var jsondata, phone, phonecf, reg;
$.ajaxSetup({
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", tokenString);
    },
});

function getTokenString() {
    var tokenString = '';
    // if (window.ActiveXObject || "ActiveXObject" in window){ //IE
        tokenString = $.cookie('Authorization') ||'';
    // }else{
    //     tokenString =sessionStorage.getItem('Authorization')||'';
    // }
    return tokenString;
}


function setTokenString(content) {
    // if (window.ActiveXObject || "ActiveXObject" in window) { //IE
        var date = new Date();
        date.setTime(date.getTime() + (3 * 60 * 60 * 1000)); // 3小时
        $.cookie('Authorization', "Bearer " + content.Authorization, {path: '/', expires: date});
    // } else {
    //     sessionStorage.setItem('Authorization', "Bearer " + content.Authorization);
    // }
}

function clearToken(){
    // if (window.ActiveXObject || "ActiveXObject" in window){ //IE
        // document.cookie = "Authorization" + "="+ tokenString + ";expires=" + new Date().toGMTString();
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    // }else{
    //     sessionStorage.setItem("Authorization",'');
    // }
}

$(function () {
    $('.loadingBlue').remove()
    //获取认证状态
    /*getUserInfo(function (resp) {
        if (resp.returnCode == '200') {
            $('.user_phonenum').text(headerUserPhone)
            var approveState = resp.data.state;
            if (approveState == 4) {
                $('.wrap-top-dy').show();
                $('.main_top_org').hide();
            } else if(approveState == 3) {
                $('.wrap-top-dy').hide();
                $('.main_top_org').show();
                //去认证
                $(".goApply").click(function () {
                    window.location.href = "/wechat/src/pages/userApplyNext.html";
                });
            } else if(approveState == 1  || approveState == 2) {
                $('.wrap-top-dy').hide();
                $('.main_top_org').show();
                //去认证
                $(".goApply").click(function () {
                    window.location.href = "/wechat/src/pages/userApply.html";
                });
            }else if (approveState == 5){
                $('.wrap-top-dy').hide();
                $('.main_top_org').show();
                //去认证
                $(".goApply").click(function () {
                    window.location.href = "/wechat/src/pages/userApply.html";
                });
            }
        }
    });*/

    //点击菜单跳转
    $(".home").click(function () {
        window.location.href = "../pages/home.html";
    });
    $(".my_order").click(function () {
        window.location.href = "../pages/myOrder.html";
    });
    $(".user_center").click(function () {
        window.location.href = "../pages/userCenter.html";
    });

    //全局处理异常
    var cacheObj = {};

    $.ajaxSetup({
        error: function (jqXHR, textStatus, errorMsg) {
            //console.log(jqXHR.status);
            // var $globalErrorShow = cacheObj.$globalErrorShow;
            // if(!$globalErrorShow || !$globalErrorShow.length){
            //     $globalErrorShow = $('<div class="abnormal_handling"></div>');
            //
            //     cacheObj.$globalErrorShow = $globalErrorShow;
            //     $(document.body).prepend($globalErrorShow);
            // }
            // if (jqXHR.status == 0) {
            //     $globalErrorShow.text('网络数据请求失败，请刷新页面或者退出重新登录');
            //
            // }
            // if (jqXHR.status == 'timeout') {//超时,status还有success,error等值的情况
            //     $globalErrorShow.text("网络连接超时，请稍后重试");
            // }
            //
            // $globalErrorShow.css({
            //     left: ($(window).width() - $globalErrorShow.width()) / 2,
            //     top: ($(window).height() - $globalErrorShow.height()) / 2
            // }).slideDown(1000, function () {
            //     setTimeout(function () {
            //         $globalErrorShow.hide();
            //         window.location.href = "/org/assets-manager/pages/user-manager/login.html";
            //     }, 3000)
            //
            // });
            setTimeout(function () {
                // $globalErrorShow.hide();
                // window.location.href = "/org/assets-manager/pages/user-manager/login.html";
            }, 3000)

        },
        complete: function (XMLHttpRequest, status) {
            // 令牌失效
            console.log(XMLHttpRequest.responseJSON);
            if(!XMLHttpRequest.responseJSON == undefined || !XMLHttpRequest.responseJSON == null || !XMLHttpRequest.responseJSON == ""){
                if(XMLHttpRequest.responseJSON.returnCode == "11001" || XMLHttpRequest.responseJSON.returnMessage == "token丢失或错误"){
                    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    greenAlertBox("未登录，需登录后查看")
                    setTimeout("window.location.href = '../pages/login.html'", 1500);
                    $('.loadingBlue').remove()
                }
            }
        }
    });

});


// 页面列表显示数据为空,表格显示的提示
function emptyData(table, dataList) {
    if (typeof dataList == "undefined" || dataList.length <= 0) {
        if ($(table).siblings(".layui-form").length > 0) {
            $(table).siblings(".layui-form").remove();
        }
        if ($(table).siblings(".page-style").length > 0) {
            $(table).siblings(".page-style").hide();
        }
        $(table).addClass("w100").html("<p class='empty-back'>未查询到相关信息</p>");
    } else {
        $(table).removeClass("w100").empty();
        if ($(table).siblings(".page-style").length > 0) {
            $(table).siblings(".page-style").show();
        }
    }
}

//手机号正则
function checkPhone(phone) {
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
    if (!mobile.test(phone)) {
        return false
    } else {
        return true
    }
}

//密码正则
function checkPassword(password) {
    var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{6,16}$/;
    // var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9\!\.\@\#\$\%\^\&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]{8,16}$/;
    if (!reg.test(password)) {
        return false
    } else {
        return true
    }
}

//邮箱格式正则
function emailCheck(email) {
    var isEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!isEmail.test(email)) {
        return false
    } else {
        return true
    }
}

function isEmailValid(email){
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)
}

// 验证码
function checkCodeCheck(checkCode) {
    var isCode = /^\d{6}$/;
    if (!isCode.test(checkCode)) {
        return false
    } else {
        return true
    }
}

//姓名校验
function chinaNameCheck(name) {
    // const isChinaName = /^[\u4E00-\u9FA5]{1,6}$/;
    var isChinaName = /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/;
    // return pattern.test(name);
    if (!isChinaName.test(name)) {
        return false
    } else {
        return true
    }
}

function amountCheck(amount) {
    var isAmountCheck = /^\+?[1-9][0-9]*$/;
    if (!isAmountCheck.test(amount)) {
        return false
    } else {
        return true
    }
}



//倒计时方法
function countDown(obj) {
    var wait = 60;
    settime(obj);

    function settime(obj) {
        if (wait == 0) {
            $(obj).attr("disabled", false);
            $(obj).text("发送验证码");
            $(obj).css({'color': '#0080CC',"border-left":"1px solid #E9EAEC"});
            wait = 60;
            return;
        } else {
            $(obj).attr("disabled", true);
            $(obj).text("(" + wait + ") 秒 ");
            $(obj).css({'color': '#E9EAEC',"border-left":"1px solid #E9EAEC"});
            wait--;
        }
        setTimeout(function () {
                settime(obj)
            }
            , 1000)
    }
};


//
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    };
    code = $.getUrlParam('code')
    window.sessionStorage.setItem("code",code);
})(jQuery);

//消息管理页面  messageTo，需要获取
// var messageTo = '1123';

//获取认证状态  认证页面 home页 资产核验页面
//获取用户信息
var monitorEmail //监控邮箱
var monitorPhone //监控手机号
var headerUserPhone //用户手机号
var approveState;//认证状态
var approveStateName;//认证姓名
var approveStateEmail;//认证邮箱
var approveStateFile;//认证名片
/*function getUserInfo(callback) {
    tokenString = getTokenString();
    $.ajax({
        type: "post",
        url: BASEURL + '/orgUser/info',
        // data: '',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        async: false,
        crossDomain: true == !(document.all),
        success: function (resp) {
            // console.log(data)
            if (resp.returnCode == '200') {
                monitorEmail = resp.data.monitorEmail
                monitorPhone = resp.data.monitorPhone
                headerUserPhone = resp.data.phone
                approveState = resp.data.state
                approveStateName = resp.data.name
                approveStateEmail = resp.data.email
                approveStateFile = resp.data.visitingCardId
            }
            if (typeof callback === 'function') {
                callback(resp)
            }
        }
    });

}
// getUserInfo();*/


//退出系统
function  exitSystem(){
    $.ajax({
        type:"post",
        url:BASEURL + '/user/logout',
        data:'',
        contentType:'application/json;charset=utf-8',
        dataType: 'json',
        async: true,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", getTokenString());
        },
        success:function(resultData){
            console.log(resultData);
            if (resultData.returnCode == '200') {
                clearToken();
                 window.location.href = '../pages/login.html'
                $('.loadingBlue').remove()
            } else {
            }
        },
        error: function (resp) {
        }
    });
}
//弹出提示弹框
function greenAlertBox(message){
    $('body').append('<div class="popupParent"><span class="popup">'+message+'</span></div>');
    setTimeout(function () {
        $('.popupParent').remove();
    },1500);
}
//loading

function loadingBlue(){
    $('body').append('<div class="loadingBlue">\n' +
        '<div class="loadEffect">\n' +
        '        <div><span></span></div>\n' +
        '        <div><span></span></div>\n' +
        '        <div><span></span></div>\n' +
        '        <div><span></span></div>\n' +
        '</div>\n' +
        '<div class="loadText"><p>拼命加载中</p></div>\n' +
    '</div>\n');
}



