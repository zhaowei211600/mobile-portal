loadingBlue()
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