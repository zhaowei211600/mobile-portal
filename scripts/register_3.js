loadingBlue()
$(function () {

    $("#login").click(function () {
        var cardImgFront = localStorage.getItem("user.cardImgFront");
        var cardImgBack = localStorage.getItem("user.cardImgBack");
        var phone =  localStorage.getItem("user.phone");
        var messageCode = localStorage.getItem("user.messageCode");
        var realName = localStorage.getItem("user.realName");
        var cardNo = localStorage.getItem("user.cardNo");

        var password = $("#password").val();
        var passwordAgain = $("#passwordAgain").val();
        passcheck =  checkPassword(password);
        if(!password){
            greenAlertBox("密码不符合规则！");
            return false;
        }
        if(password != passwordAgain){
            greenAlertBox("两次输入的密码不一致！")
            return false;
        }

        /*var frontFileName = localStorage.getItem("user.cardImgFront.name");
        var frontFileType = localStorage.getItem("user.cardImgFront.type");
        var frontFileContent = localStorage.getItem("user.cardImgFront.result");
        var cardImgFrontFile = new File([frontFileContent],frontFileName, {"type":""+frontFileType+""});

        var backFileName = localStorage.getItem("user.cardImgBack.name");
        var backFileType = localStorage.getItem("user.cardImgBack.type");
        var backFileContent = localStorage.getItem("user.cardImgBack.result");
        var cardImgBackFile = new File([backFileContent],backFileName, {"type":""+backFileType+""});*/
        var form = new FormData();
        form.append("cardImgBack", cardImgBack);
        form.append("cardImgFront", cardImgFront);
        form.append("phone", phone);
        form.append("password", password);
        form.append("messageCode", messageCode);
        form.append("cardNo", cardNo);
        form.append("realName", realName);


        loadingBlue()
        register(form)
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