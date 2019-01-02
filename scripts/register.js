loadingBlue()
var cardImgFront;
var cardImgBack;
$(function () {
    "use strict";
    $('.loadingBlue').remove()
    var jsondata,phone,password,passcheck,phonecheck,captcha,reg,realName, cardNo;
    $(".l-close, .agree").click(function () {
        $("#user-layer").hide();
    });
    $("#yhxy").click(function () {
        $("#user-layer").show();
    });

    $("#login").click(function () {
        phone = $("#phone").val();
        password = $("#password").val();
        passcheck =  checkPassword(password);
        captcha = $("#yzm").val();
        realName = $("#realName").val();
        cardNo = $("#cardNo").val();

        phonecheck = checkPhone(phone,1,passcheck,password,captcha);
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
        var form = new FormData();
        form.append("cardImgBack", cardImgBack);
        form.append("cardImgFront", cardImgFront);
        form.append("phone", phone);
        form.append("password", password);
        form.append("messageCode", captcha);
        form.append("cardNo", cardNo);
        form.append("realName", realName);


        loadingBlue()
        register(form)
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

    //登录校验ajax，登陆成功 重定向 失败  alert（）
    function register(params) {
        $.ajax(
            {
                url: BASEURL +"/user/register",
                type:"post",
                data:params,
                processData: false,
                contentType: false,
                crossDomain: true == !(document.all),
                success:function (data) {
                    if(data.returnCode == 200 ){
                        greenAlertBox('注册成功，请登录');
                        setTimeout('window.location.href = "../pages/login.html"',1000);
                        $('.loadingBlue').remove();
                    }else {
                        var message = data.returnMessage || '注册失败！';
                        $('.loadingBlue').remove();
                        greenAlertBox(message);
                    }
                }
            }
        )
    }

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
    function checkPhone(phone,buttonStatus,passcheck,password,captcha) {
        var mobile=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
        if(!mobile.test(phone)){
            return false
        }else{
            return true
        }
    }
    //密码正则
    function checkPassword(password) {
        reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{8,16}$/;
        // reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9\!\.\@\#\$\%\^\&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]{8,16}$/;
        if(!reg.test(password)){
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

//上传图片
function validateCardImgFront(ele) {
    var file = ele.value;
    if (!/.(jpg|jpeg|png)$/.test(file)) {
        // alert('请上传正确格式的个人名片')
        greenAlertBox( '请上传正确格式证件照')
        return false;
    } else {
        if (((ele.files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {
            // alert('请上传小于5M的图片')
            greenAlertBox( '请上传小于2M的图片')
            return false;
        } else {
            // $('.tipShow').show();
            //获取文件
            var file = $("#cardImgFront")[0].files[0];
            //创建读取文件的对象
            var reader = new FileReader();
            //创建文件读取相关的变量

            //为文件读取成功设置事件
            reader.onload = function (e) {
                // alert('文件读取完成');
                cardImgFront = file;
                //console.log(cardImgFront);
                $("#cardImgFront_img").attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
}

function validateCardImgBack(ele) {
    var file = ele.value;
    if (!/.(jpg|jpeg|png)$/.test(file)) {
        // alert('请上传正确格式的个人名片')
        greenAlertBox( '请上传正确格式证件照')
        return false;
    } else {
        if (((ele.files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {
            // alert('请上传小于5M的图片')
            greenAlertBox( '请上传小于2M的图片')
            return false;
        } else {
            // $('.tipShow').show();
            //获取文件
            var file = $("#cardImgBack")[0].files[0];
            //创建读取文件的对象
            var reader = new FileReader();
            //创建文件读取相关的变量

            //为文件读取成功设置事件
            reader.onload = function (e) {
                // alert('文件读取完成');
                cardImgBack = file;

                //console.log(cardImgFront);
                $("#cardImgBack_img").attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
            //uploadFile(file);
        }
    }
}

function uploadFile(data) {
        var formData = new FormData();
        formData.append("file",data);
        //压缩后异步上传
        $.ajax({
            url : BASEURL + "/user/file/upload",
            type: "POST",
            data : formData,
            processData: false,
            contentType: false,
            crossDomain: true == !(document.all),
            success : function(data) {
                alert("成功");
            },
            error : function(){

            }
        });
}