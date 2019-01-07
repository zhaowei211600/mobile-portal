loadingBlue()
$(function () {

    $("#login").click(function () {
        var phone = $("#phone").val();
        var captcha = $("#yzm").val();
        phonecheck = checkPhone(phone);
        if(!phonecheck) {
            if (phone == '' || phone == null) {
                //alert("用户名不能为空！");
                greenAlertBox("手机号不能为空");
                return false
            }else {
                greenAlertBox("手机号不正确");
            }
            return false
        }
        localStorage.setItem("user.phone", phone);
        localStorage.setItem("user.messageCode", captcha);
        loadingBlue()
        window.location.href = '../pages/register_3.html';

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
        getyzm(phone);
    });

    //校验手机短信验证码
    function getyzm(phone) {
        jsondata = {"phone":phone,"type":1};
        $.ajax(
            {
                url: BASEURL +"/user/verification",
                type:"post",
                dataType:"json",
                // data:JSON.stringify(jsondata),
                // contentType:'application/json',
                data:jsondata,
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                success:function (data) {
                    if(data.returnCode == 200 ){
                        $("#btn-yzm").attr("disabled", true);
                        greenAlertBox('验证码发送成功！');
                        countDown(60);
                    }else if(data.returnCode == 10003 ){
                        greenAlertBox("该手机号已经注册！");
                    }else {
                        var message = data.returnMessage || '发送失败！';
                        greenAlertBox(message);
                    }
                },
                error:function (xhr,status,p3,p4) {
                }
            }
        )
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
