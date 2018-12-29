$(function () {
    var name;
    var nameEle = $('#authUserName');
    var imgFile;
    var fileEle = $('#fileUp');
    var email;
    var emailEle = $('#email');
    var emailCheckCode;
    var emailCheckCodeEle = $('#emailYzm');

    //名字校验
    function nameVerify() {
        name = $.trim(nameEle.val());
        if (!name) {
            greenAlertBox('请输入真实的姓名')
            return false
        } else if (!chinaNameCheck(name)) {
            greenAlertBox('姓名格式不正确')
            return false
        }
    }

    //名字输入校验
    nameEle.blur(function () {
        nameVerify()
    })

    //邮箱校验
    function emailVerify() {
        email = $.trim(emailEle.val());
        if (!email) {
            greenAlertBox( '请输入邮箱')
            return false
        } else if (!emailCheck(email)) {
            greenAlertBox('邮箱格式不正确')
            return false
        }else{
            return true;
        }
    }

    //邮箱输入校验
    emailEle.blur(function(){
        emailVerify();
    });

    emailEle.on('input',function(){
        if(!isEmailValid(emailEle.val())){
            $("#btn-yzm").attr("disabled", true);
        }else{
            $("#btn-yzm").attr("disabled", false);
        }
    });

    //验证码校验
    function emailCheckCodeVerify() {
        emailCheckCode = $.trim(emailCheckCodeEle.val());
        if (!emailCheckCode) {
            greenAlertBox('请输入验证码')
            return false
        } else if (!checkCodeCheck(emailCheckCode)) {
            greenAlertBox('验证码不正确')
            return false
        }
    }

    //验证码输入校验
    emailCheckCodeEle.blur(function () {
        emailCheckCodeVerify()
    })
    //下一步
    $('#next').click(function () {
        name = $.trim(nameEle.val());
        if (!name) {
            greenAlertBox( '请输入真实的姓名')
            return false
        }
        imgFile = $('#fileUp')[0].files[0];

        if (!imgFile) {
            greenAlertBox('请上传企业名片')
            return false
        }
        email = emailEle.val();
        emailCheckCode = emailCheckCodeEle.val();
        if (!email ) {
            greenAlertBox('请输入邮箱')
            return false
        }
        if (!emailCheckCode ) {
            greenAlertBox('请输入验证码')
            return false
        }
        if (name && imgFile && email && emailCheckCode) {
            var form = new FormData();
            form.append("file", imgFile);
            form.append("userName", name);
            form.append("email", email);
            form.append("captcha", emailCheckCode);
            loadingBlue()
            subRenzheng(form)
        }
    })
    //验证码获取
    $('#btn-yzm').click(function () {
        email = emailEle.val();
        // email = 'jindongyin@baiwang.com'
        if (email == '' || null) {
            greenAlertBox( '请输入邮箱');
            return;
        }else if (!isEmailValid(email)) {
            greenAlertBox('邮箱格式不正确')
            return;
        }   else {
            $("#btn-yzm").attr("disabled", true);
            $.ajax({
                type: "post",
                url: BASEURL + '/orgUser/getEmailCaptcha?email=' + email,
                // data: JSON.stringify({'email':email}),
                // data: ({'email':email}),
                // dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    $("#btn-yzm").attr("disabled", false);
                    // console.log(data.returnMessage)
                    if (data.returnCode == '200') {
                        new countDown("#btn-yzm");
                    } else if(data.returnCode == '500'){
                        greenAlertBox( '发送失败')
                    }else{
                        greenAlertBox( data.returnMessage)
                    }
                },
                error: function (data) {
                    $("#btn-yzm").attr("disabled", false);
                    console.log(data);
                }
            });

        }
    })

    $("#btn-yzm").mousedown(function () {
        $(".yzm-right").css({"background":"#E9EAEC"})
    });
    $("#btn-yzm").mouseup(function () {
        $(".yzm-right").css({"background":"#fff"})
    })
});
//上传图片
function validate_img(ele) {
    var file = ele.value;
    if (!/.(jpg|jpeg|png)$/.test(file)) {
        // alert('请上传正确格式的个人名片')
        greenAlertBox( '请上传正确格式的个人名片')
        return false;
    } else {
        if (((ele.files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {
            // alert('请上传小于5M的图片')
            greenAlertBox( '请上传小于2M的图片')
            return false;
        } else {
            // $('.tipShow').show();
            //获取文件
            var file = $("#fileUp")[0].files[0];
            //创建读取文件的对象
            var reader = new FileReader();
            //创建文件读取相关的变量

            //为文件读取成功设置事件
            reader.onload = function (e) {
                // alert('文件读取完成');
                imgFile = e.target.result;
                // console.log(imgFile);
                $(".wrap-companyImg img").attr('src', imgFile);
            };
            reader.readAsDataURL(file);
        }
    }
}
//提交认证信息
function subRenzheng(params) {
    $.ajax({
        type: "post",
        url: BASEURL + '/orgUser/authentication',
        // data: JSON.stringify(params),
        data: params,
        // contentType: 'application/json;charset=utf-8',
        // dataType: 'json',
        // async: true,
        processData: false,
        contentType: false,
        crossDomain: true == !(document.all),
        success: function (data) {
            //console.log(resultData);
            if (data.returnCode == '200') {
                window.location.href = "/wechat/src/pages/userApplyNext.html";
                $('.loadingBlue').remove();
            } else {
                // window.location.href = "/wechat/src/pages/userApplyFail.html";
                $('.loadingBlue').remove();
                greenAlertBox(data.returnMessage);
            }
        }
    });
}

// 认证返回操作
+(function(){
    console.log(window.location.search.substr("1").split("="));
    if(window.location.search.substr("1").split("=")[1] == "login") {
        $(".approveBack").click(function(e){
            e.preventDefault();
            window.location.href = "/wechat/src/pages/assetsManage.html";
        })
    }
})();