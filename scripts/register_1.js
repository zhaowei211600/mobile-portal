loadingBlue()
$("#register_next").click(function () {
    var realName = $("#realName").val();
    var cardNo = $("#cardNo").val();
    var cardImgFront = localStorage.getItem("user.cardImgFront.name");
    var cardImgBack = localStorage.getItem("user.cardImgBack.name");


    /*if (checkRealName(realName)) {
        greenAlertBox('姓名只允许输入中文！');
        return false;
    }*/
    /*if (checkCardNo(cardNo)) {
        greenAlertBox('证件号码不符合要求！');
        return false;
    }*/

    localStorage.setItem("user.realName", realName);
    localStorage.setItem("user.cardNo", cardNo);
    loadingBlue()
    window.location.href = '../pages/register_2.html';
});

/*function checkRealName(realName) {
    var nameFormat = /^[\u4e00-\u9fa5]$/;
    if (!realName.test(nameFormat)) {
        return false
    } else {
        return true
    }
}*/

function checkCardNo(cardNo) {
    var cardNoFormat = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!cardNo.test(cardNoFormat)) {
        return false
    } else {
        return true
    }
}

//上传图片
function validateCardImgFront(ele) {
    var file = ele.value;
    if (!/.(jpg|jpeg|png)$/.test(file)) {
        // alert('请上传正确格式的个人名片')
        greenAlertBox('请上传正确格式证件照')
        return false;
    } else {
        if (((ele.files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {
            // alert('请上传小于5M的图片')
            greenAlertBox('请上传小于2M的图片')
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
                localStorage.setItem("user.cardImgFront.name", file.name);
                localStorage.setItem("user.cardImgFront.type", file.type);
                localStorage.setItem("user.cardImgFront.result", e.target.result);
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
        greenAlertBox('请上传正确格式证件照')
        return false;
    } else {
        if (((ele.files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {
            // alert('请上传小于5M的图片')
            greenAlertBox('请上传小于2M的图片')
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
                localStorage.setItem("user.cardImgBack.name", file.name);
                localStorage.setItem("user.cardImgBack.type", file.type);
                localStorage.setItem("user.cardImgBack.result", e.target.result);

                //console.log(cardImgFront);
                $("#cardImgBack_img").attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
            //uploadFile(file);
        }
    }
}

/*
function uploadFile() {

    var formData = new FormData();
    formData.append("file",storageFile);
    //压缩后异步上传
    $.ajax({
        url : BASEURL + "/user/file/upload",
        type: "POST",
        data : formData,
        processData: false,
        contentType: false,
        crossDomain: true == !(document.all),
        success : function(data) {
            attr = data;
        },
        error : function(){
            greenAlertBox("文件上传失败！");
        }
    });
}*/
