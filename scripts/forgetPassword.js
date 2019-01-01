loadingBlue()
$(function () {
    "use strict";
    $('.loadingBlue').remove()
    //重新登录
    $(".login-href").click(function () {
        window.location.href = "../pages/login.html"
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
        if (!phonecheck) {
            greenAlertBox("手机号输入不正确");
            return false
        }
        if (!passcheck) {
            greenAlertBox("密码输入格式不正确");
            return false
        }
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

        loadingBlue()
        getjson(phone,password,captcha,password2);
        /*jsondata = {"phone":phone};
        $.ajax(
            {
                url: BASEURL +"/user/exist",
                type:"post",
                dataType:"json",
                data:jsondata,
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                success:function (data) {
                    // console.log(data);
                    if (data.returnCode == 10004) {
                        greenAlertBox("该用户不存在");
                    }else {


                    }
                }
            }
        );*/
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
        $("#btn-yzm").attr("disabled", true);
        getyzm(phone);
    });


    //登录校验ajax，登陆成功 重定向 失败  alert（）
    function getjson(phone,password,code,password2) {
        jsondata = {"phone":phone,"messageCode":code,"password":password,"passwordAgain":password2};
        $.ajax(
            {
                url: BASEURL +"/user/password/reset",
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
    function checkPhone(phone) {
        const mobile=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
        if(!mobile.test(phone)){
            return false
        }
        /*else{
            jsondata = {"phone":phone};
            $.ajax(
                {
                    url: BASEURL +"/user/exist",
                    type:"post",
                    dataType:"json",
                    data:jsondata,
                    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                    success:function (data) {
                        // console.log(data);
                        if(data.returnCode == 10004){
                            $("#btn-yzm").attr("disabled", true);
                            return true;
                        }
                        if(data.returnCode == 10003 ){
                            greenAlertBox("该手机号已被注册");
                        }else {
                            greenAlertBox(data.returnMessage);
                            return false
                        }
                    }
                }
            );
            return true
        }*/
        return true;
    }
    //获取手机短信验证码
    function getyzm(phone) {
        jsondata = {"phone":phone, "type":2};
        $.ajax(
            {
                url: BASEURL +"/user/verification",
                type:"post",
                dataType:"json",
                data:jsondata,
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                success:function (data) {
                    if(data.returnCode == 200 ){
                        $("#yzmerror").hide();
                        countDown(60);
                        greenAlertBox("短信验证码发送成功！");
                        return;
                    }else if(data.returnCode == 10004 ){
                        greenAlertBox("手机号未注册");
                    }else {
                        var message = data.returnMessage;
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