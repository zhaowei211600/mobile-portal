loadingBlue()
$(function () {
    "use strict";
    $('.loadingBlue').remove()
    //重新登录
    $(".login-href").click(function () {
        window.location.href = "/wechat/src/pages/login.html"
    });

    var jsondata,phone,phonecheck,password,password2,passcheck,captcha,phonecf,reg,buttonStatus;

    //重置密码
    $("#login").click(function () {
        captcha = $("#yzm").val();
        phone=$("#phone").val();
        password = $("#newPassword").val();
        password2 = $("#twicePassword").val();
        passcheck =  checkPassword(password);
        phonecheck = checkPhone(phone,1,passcheck,password,password2);
        if(!phonecheck) {
            if (!phone) {
                //alert("用户名不能为空！");
                greenAlertBox("手机号不能为空");
                return false
            }else {
                greenAlertBox("手机号不正确");
            }
            return false
        }
    });
    //手机号验证码校验
    $("#btn-yzm").on('click',function () {
        phone = $("#phone").val();
        phonecheck = checkPhone(phone,2);
        if(!phonecheck) {
            if (phone == '' || phone == null) {
                //alert("用户名不能为空！");
                greenAlertBox("手机号不能为空");
                return false
            }
            else {
                greenAlertBox("手机号格式不正确");
            }
            return false
        }
    });


    //登录校验ajax，登陆成功 重定向 失败  alert（）
    function getjson(phone,password,code,cert) {
        jsondata = {"phone":phone,"captcha":code,"password":password,"cert":cert};
        $.ajax(
            {
                url: BASEURL +"/password/reset?code="+code,
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
                    }
                }
            }
        )
    }
//手机号正则
    function checkPhone(phone,buttonStatus,passcheck,password,password2) {
        const mobile=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
        if(!mobile.test(phone)){
            return false
        }else{
            jsondata = {"phone":phone};
            $.ajax(
                {
                    url: BASEURL +"/check/user",
                    type:"post",
                    dataType:"json",
                    data:jsondata,
                    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                    success:function (data) {
                        // console.log(data);
                        if (data.returnCode == 202) {
                            greenAlertBox("该用户不存在");
                        }else {
                            if(buttonStatus == 1){
                                if(!passcheck){
                                    //alert("密码格式不正确");
                                    if(!password)
                                    {
                                        greenAlertBox("密码不能为空");
                                        return false
                                    }else{
                                        greenAlertBox("密码格式不正确");
                                    }
                                    return false
                                }
                                if(password !== password2){
                                    greenAlertBox("两次密码不一致");
                                    return false
                                }
                                if(!captcha){
                                    greenAlertBox("验证码不能为空");
                                    return false
                                }
                                if(!window.verifySuccess){
                                    greenAlertBox("请进行滑动验证");
                                    return false
                                }else{
                                    loadingBlue()
                                    getjson(phone,password,captcha,cert);
                                }
                            }else if(buttonStatus == 2){
                                if(!window.verifySuccess){
                                    greenAlertBox("请进行滑动验证");
                                    return false
                                }else{
                                    $("#btn-yzm").attr("disabled", true);
                                    getyzm(phone);
                                    countDown(60);
                                }
                            }

                        }
                    }
                }
            );
            return true
        }
    }
    //校验手机短信验证码
    function getyzm(phone) {
        jsondata = {"phone":phone,"captcha":captcha};
        $.ajax(
            {
                url: BASEURL +"/sms",
                type:"post",
                dataType:"json",
                data:jsondata,
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                success:function (data) {
                    if(data.returnCode == 200 ){
                        $("#yzmerror").hide();
                    }else if(data.returnCode == 500 ){
                        greenAlertBox("发送失败");
                    }else {
                        var message = data.returnMessage || '验证码错误！';
                        greenAlertBox(message);
                    }
                },
                error:function (xhr,status,p3,p4) {
                }
            }
        )
    }

    //获取手机验证码倒计时
    function countDown(timeLeft) {
        var timeId = 0;
        $(function (){
            timeId = setInterval(function () {
                if(timeLeft <= 0){
                    clearInterval(timeId);
                    $("#btn-yzm").text("发送验证码");
                    $("#btn-yzm").attr("disabled", false);
                    $("#btn-yzm").css({
                        "border-color":"#0080CC",
                        "background":"#0080CC",
                        "color":"#fff"
                    })
                }else {
                    $("#btn-yzm").attr("disabled", true);
                    $("#btn-yzm").text("( "+ timeLeft +" )秒");
                    $("#btn-yzm").css({
                        "border-color":"#E9EAEC",
                        "background":"#E9EAEC",
                        "color":"#fff"
                    });
                }
                timeLeft--;
            },1000);
        });
    }
});