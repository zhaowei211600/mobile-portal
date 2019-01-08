loadingBlue()
var cardImgFront;
var cardImgBack;
$("#register_next").click(function () {
    var realName = $("#realName").val();
    var cardNo = $("#cardNo").val();
    if(realName == 'undefined' || realName == '' || realName == null){
        greenAlertBox("请填写真实姓名！");
        return false;
    }
    if(cardNo == 'undefined' || cardNo == '' || cardNo == null){
        greenAlertBox("请填写证件号码！");
        return false;
    }
    if(cardImgBack == 'undefined' || cardImgBack == '' || cardImgBack == null){
        greenAlertBox("请上传身份证背面图片！");
        return false;
    }
    if(cardImgFront == 'undefined' || cardImgFront == '' || cardImgFront == null){
        greenAlertBox("请上传身份证正面图片！");
        return false;
    }
    localStorage.setItem("user.cardImgFront", cardImgFront);
    localStorage.setItem("user.cardImgBack", cardImgBack);


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
        if (((ele.files[0].size).toFixed(2)) >= (5 * 1024 * 1024)) {
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
                $("#cardImgFront_img").attr('src', e.target.result);
                var formData = new FormData();
                formData.append("file",file);
                //压缩后异步上传
                $.ajax({
                    url : BASEURL + "/user/file/upload",
                    type: "POST",
                    data : formData,
                    processData: false,
                    contentType: false,
                    crossDomain: true == !(document.all),
                    success : function(data) {
                        if(data.returnCode == '200'){
                            cardImgFront =  data.data;
                            return true;
                        }
                        greenAlertBox("文件上传失败:"+ data.returnMessage);
                    },
                    error : function(){
                        greenAlertBox("文件上传失败！");
                    }
                });
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
        if (((ele.files[0].size).toFixed(2)) >= (5 * 1024 * 1024)) {
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
                $("#cardImgBack_img").attr('src', e.target.result);
                var formData = new FormData();
                formData.append("file",file);
                //压缩后异步上传
                $.ajax({
                    url : BASEURL + "/user/file/upload",
                    type: "POST",
                    data : formData,
                    processData: false,
                    contentType: false,
                    crossDomain: true == !(document.all),
                    success : function(data) {
                        if(data.returnCode == '200'){
                           cardImgBack =  data.data;
                           return true;
                        }
                        greenAlertBox("文件上传失败:"+ data.returnMessage);
                    },
                    error : function(){
                        greenAlertBox("文件上传失败！");
                    }
                });
            };
            reader.readAsDataURL(file);
            //uploadFile(file);
        }
    }
}


function uploadFile(file) {

    var formData = new FormData();
    formData.append("file",file);
    //压缩后异步上传
    $.ajax({
        url : BASEURL + "/user/file/upload",
        type: "POST",
        data : formData,
        processData: false,
        contentType: false,
        crossDomain: true == !(document.all),
        success : function(data) {
            if(data.returnCode == '200'){
                return data.data;
            }
            greenAlertBox("文件上传失败:"+ data.returnMessage);
        },
        error : function(){
            greenAlertBox("文件上传失败！");
        }
    });
}
