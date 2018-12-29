$(function () {
    $("#apply").click(function () {
        window.location.href = "/wechat/src/pages/userApply.html";
    });
    //获取认证状态
    getUserInfo(function (resp) {
        if (resp.returnCode == '200') {
            var approveState = resp.data.state;
            if (approveState == 4) {
                $('#realName').text(approveStateName);
                $('#comEmail').text(approveStateEmail);
                if ( approveStateFile ) {
                    loadingBlue();
                    console.log('请求下载文件')
                    $.ajax({
                        type: "post",
                        url: BASEURL + '/orgUser/download',
                        data: {'fileName': approveStateFile},
                        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                        // dataType: 'json',
                        async: true,
                        crossDomain: true == !(document.all),
                        success: function (data) {
                            $('.loadingBlue').remove()
                            if (data.returnCode == 200) {
                                $('.wrap-main-messages-img .file').attr('src', 'data:image/png;base64,' + data.data)
                            }
                        }
                    });
                }
                $('#apply').click(function () {
                    window.location.href = "/wechat/src/pages/userApply.html";
                })
            }
        }
    });
    if(!$('#realName').text() || !$('#comEmail').text()){
        $(".wrap-title").hide();
        $(".wrap-main").hide();
        $(".wrap-btn").hide();
        $(".wrap-success").show();
    }else{
        $(".wrap-title").show();
        $(".wrap-main").show();
        $(".wrap-btn").show();
        $(".wrap-success").hide();
    }


});

