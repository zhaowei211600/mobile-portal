loadingBlue()
var jsondata,phone,password,passcheck,phonecheck,phonecf;
$(function () {
    // alert('页面加载 完成')
    $('.loadingBlue').remove()
    "use strict";
    //获取OpenId
    //静默授权Url
    /*(function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2]; return null;
        };
    })(jQuery);

    if(!(window.localStorage.getItem("openId"))){
        var code = window.sessionStorage.getItem("code")
        if(code){
            $.ajax({
                type: "post",
                url: BASEURL +"/mobile/wpp/openid",
                data:{"code":code},
                contentType:"application/x-www-form-urlencoded",
                success: function (data) {
                    if (data.returnCode == '200') {
                        // $("#openId").html(data.data);
                        // window.localStorage.openId = data.data;
                        window.localStorage.setItem("openId",data.data)
                    }
                }
            });
        }
    }*/

    $("#login").click(function () {
        phone = $("#phone").val();
        password = $("#password").val();
        passcheck = checkPassword(password);
        phonecheck = checkPhone(phone, passcheck, password);

        if (!phonecheck) {
            greenAlertBox("手机号输入不正确");
            return false
        }
        if (!passcheck) {
            greenAlertBox("密码输入格式不正确");
            return false
        }
        loadingBlue();
        getjson(phone, password);
    });


});

//登录校验ajax，登陆成功 重定向 失败  alert（）
function getjson(phone,password) {
    // jsondata = {"phone":'13683128571',"password":'a1234567'};
    jsondata = {"username":phone,"password":password};
    $.ajax(
        {
            url: BASEURL +"/user/login",
            type:"post",
            dataType:"json",
            data:JSON.stringify(jsondata),
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (data.returnCode == 200) {
                    var content = data.data || {};
                    if (content.Authorization) {
                        // var expTime = new Date();
                        // expTime.setTime(expTime.getTime() + 1*60*60*1000);
                        // console.log(expTime.toGMTString());
                        setTokenString(content);
                        window.location.href = '../pages/userCenter.html';
                        $('.loadingBlue').remove();
                    }
                }
                else {
                    $('.loadingBlue').remove();
                    var message = data.returnMessage || '登录失败！';
                    greenAlertBox(message)
                }
            }
        }
    );
}
//密码正则
function checkPassword(password) {
    var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9\!\.\@\#\$\%\^\&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]{6,16}$/;
    if(!reg.test(password)){
        return false
    }else{
        return true
    }
}
//手机号正则
function checkPhone(phone) {
    var mobile=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
    if(!mobile.test(phone)){
        return false
    }else{
        return true
    }
}
