$(function () {
    var userName,password,passcheck,userNamecheck;
    $("#transfer").click(function () {
        $(".transfer-prompt").hide();
        $(".transfer-login").show();
        $(".transfer-success").hide();
    });
    $("#success-href").click(function () {
        $(".transfer-prompt").show();
        $(".transfer-login").hide();
        $(".transfer-success").hide();
        window.location.href = "/wechat/src/pages/myAssets.html";
    });
    $("#login").click(function () {
        userName = $("#userName").val();
        password = $("#password").val();
        passcheck =  checkPassword(password);
        userNamecheck = checkUserName(userName);
        if(!userNamecheck) {
            if (!userName) {
                greenAlertBox("用户名不能为空");
                return false
            }else {
                greenAlertBox("用户名不正确");
            }
            return false
        }
        if(!passcheck){
            //alert("密码格式不正确");
            if(password == '' || password == null)
            {
                greenAlertBox("密码不能为空");
                return false
            }else{
                greenAlertBox("密码格式不正确");
            }
            return false
        }
        if(!window.verifySuccess){
            greenAlertBox("请进行滑动验证");
            return false
        }else{
            loadingBlue();
            getjson(userName,password,cert);
        }
    });
});
//登录校验ajax，登陆成功 重定向 失败  alert（）
function getjson(userName,password,cert) {
    // jsondata = {"phone":'13683128571',"password":'a1234567'};
    jsondata = {"userName":userName,"password":password,"cert":cert};
    $.ajax(
        {
            url: BASEURL +"/invoice/transfer/login",
            type:"post",
            dataType:"json",
            data:jsondata,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            success: function (data) {
                if (data.returnCode == 200) {
                    $('.loadingBlue').remove();
                    loadingBlack();
                    var oldUserId = data.data;
                    getUserId(oldUserId);
                }  else {
                    $('.loadingBlue').remove();
                    greenAlertBox(data.returnMessage)
                }
            },
            error: function () {
                $('.loadingBlue').remove();
                greenAlertBox("网络异常");
            }
        }
    );
}
function getUserId(oldUserId) {
    jsondata = {"oldUserId":oldUserId};
    $.ajax(
        {
            url: BASEURL +"/invoice/transfer",
            type:"post",
            dataType:"json",
            data:jsondata,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            success: function (data) {
                if (data.returnCode == 200) {
                    $('.loadingBlack').remove();
                    $(".transfer-prompt").hide();
                    $(".transfer-login").hide();
                    $(".transfer-success").show();
                    var content = data.data;
                    $("#success-num").text(content);
                }  else {
                    $('.loadingBlack').remove();
                    greenAlertBox(data.returnMessage)
                }
            },
            error: function () {
                $('.loadingBlack').remove();
                greenAlertBox("网络异常");
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
//账号正则
function checkUserName(userName) {
    var reg=/^[A-Za-z0-9]{6,20}$/;
    if(!reg.test(userName)){
        return false
    }else{
        return true
    }
}
//loading
function loadingBlack(){
    $('body').append('<div class="loadingBlack">\n' +
        '<div class="loadEffect">\n' +
        '        <div><span></span></div>\n' +
        '        <div><span></span></div>\n' +
        '        <div><span></span></div>\n' +
        '        <div><span></span></div>\n' +
        '</div>\n' +
        '<div class="loadText"><p>资产正在迁移中</p></div>\n' +
        '</div>\n');
}
