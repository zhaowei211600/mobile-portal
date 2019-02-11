$(function () {
    "use strict";
    var jsondata,passwordOld,passwordNew,passwordTow,passcheck,passcheckOld,passcheckNew,reg;

    //重置密码
    $("#login").click(function () {
        passwordOld = $("#password").val();
        passwordNew = $("#newPassword").val();
        passwordTow = $("#twicePassword").val();
        passcheckOld =  checkPassword(passwordOld);
        passcheckNew =  checkPassword(passwordNew);
        if(!passcheckOld){
            //alert("密码格式不正确");
            if(passwordOld == '' || passwordOld == null)
            {
                greenAlertBox("登录密码不能为空");
                return false
            }else{
                greenAlertBox("登录密码格式不正确");
            }
            return false
        }
        if(!passcheckNew){
            //alert("密码格式不正确");
            if(passwordNew == '' || passwordNew == null)
            {
                greenAlertBox("新密码不能为空");
                return false
            }else{
                greenAlertBox("新密码格式不正确");
            }
            return false
        }
        if(passwordOld == passwordNew){
            greenAlertBox("登录密码不能与新密码一致");
            return false
        }
        if(passwordNew !== passwordTow){
            greenAlertBox("两次密码不一致");
            return false
        }
        loadingBlue()
        getjson(passwordOld,passwordNew,passwordTow);
    });

    //重新登录
    $(".login-href").click(function () {
        window.location.href = "../pages/login.html"
    });


    //登录校验ajax，登陆成功 重定向 失败  alert（）
    function getjson(oldPwd,newPwd,confirmPwd) {
        jsondata = {"password":oldPwd,"newPassword":newPwd,"twicePassword":confirmPwd};
        $.ajax(
            {
                url: BASEURL +"/user/password/modify ",
                type:"post",
                dataType:"json",
                data:jsondata,
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                success:function (data) {
                    $('.loadingBlue').remove()
                    if(data.returnCode == 200)
                    {
                        $(".wrap-change").hide();
                        $(".wrap-success").show();
                    }else {
                        greenAlertBox(data.returnMessage);
                        return false
                    }
                    //alert(localStorage.getItem('token'))
                }
            }
        )
    }

    //密码正则
    function checkPassword(password) {
        reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{6,8}$/;
        // reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9\!\.\@\#\$\%\^\&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]{8,16}$/;
        if(!reg.test(password)){
            return false
        }else{
            return true
        }
    }

});