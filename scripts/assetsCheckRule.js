var jeorjym = true;
$(document).ready(function (e) {
	//校验发票代码，判断金额或者校验码显示
	function switchje(num) {
		if (num == 1 || num == 3) {
			jeorjym = true;
			//校验码隐藏
			$("#checkCodeLastSix").hide();
			//显示不含税金额
			$("#noContainTax").show();
			// $('#totalAmountVal').val('')
		} else if (num == 2) {
			jeorjym = false;
			//显示校验码
			$("#checkCodeLastSix").show();
			//隐藏不含税金额
			$("#noContainTax").hide();
			// $("#totalAmountVal").val("");
		}
	}
	if ($("#invoiceCodeVal").val()){
		var invoiceCodeVal = $.trim($('#invoiceCodeVal').val());
		checkInvoceType(invoiceCodeVal);

	}
//如果为12位，第1位是1机动车票*第1位是0 第11-12位是11 电子票*第11-12位是06、07 卷票*
// //如果为10位，第8位为1、5 增专票*第8位为2、7 货运票*第8位为3、6 增普票
	$("#invoiceCodeVal").blur(function () {
		var invoiceCodeVal = $.trim($('#invoiceCodeVal').val());
		checkInvoceType(invoiceCodeVal);

	});


	//监听扫一扫
	// $('.assets_manual_list input').keydown(function (event) {
	// 	// console.log(1)
	// 	$this=$(this);
	// 	// $this.select()
	// 	if (event.keyCode == 13) {
	// 		setTimeout(function () {
	// 			// $this.blur();
	// 			$this.focus();
	// 		},1500);
	// 		var scanVal =  $(this).val().trim().replace(/，/ig,',') ;
	// 		var codeArr = scanVal.split(',') || scanVal.split('，');
	// 		console.log(scanVal);
	// 		if (codeArr.length == 0) return;
	// 		//判断显示金额或者校验码
	// 		if (codeArr.length > 4) {
	// 			billingDateVal = codeArr[5].substr(0, 4) + '-' + codeArr[5].substr(4, 2) + '-' + codeArr[5].substr(6, 2);
	// 			codeList = codeArr[2];
	// 			invoiceNumVal = codeArr[3];
	// 			CheckCodeVal = codeArr[6].substr(codeArr[6].length - 6);
	// 			totalAmountVal = codeArr[4];
	// 			if (codeList.length == 10) {
	// 				if (codeList[7] == 1 || codeList[7] == 2 || codeList[7] == 5 || codeList[7] == 7) {
	// 					switchje(1);
	// 				} else if (codeList[7] == 3 || codeList[7] == 6) {
	// 					switchje(2);
	// 				} else {
	// 					switchje(3);
	// 				}
	// 			} else if (codeList.length == 12) {
	// 				if (codeList[0] == 0 && (codeList[10] == 1 || codeList[10] == 6 || codeList[11] == 1 || codeList[11] == 7)) {
	// 					switchje(2);
	// 				} else if (codeList[0] == 1) {
	// 					switchje(1);
	// 				} else {
	// 					switchje(3);
	// 				}
	// 			}
    //
	// 			setTimeout(function () {
	// 				$('#invoiceCodeVal').val(codeList.replace(/\s/g, ''));
	// 				$('#invoiceNumVal').val(invoiceNumVal.replace(/\s/g, ''));
	// 				$('#billingDateVal').val(billingDateVal.replace(/\s/g, ''));
	// 				$('#totalAmountVal').val(totalAmountVal.replace(/\s/g, ''));
	// 				$('#CheckCodeVal').val(CheckCodeVal.replace(/\s/g, ''));
	// 			}, 5);
    //
	// 			setTimeout(function () {
	// 				// var scanParams = {};
	// 				// timer=setInterval(loading,300)
	// 				// function loading(){
	// 				// 	num++;
	// 				// 	if(num>2){num=0}
	// 				// 	$('#check').text( ings[num] )
	// 				// };
	// 				// scanParams['invoiceCode'] = invoiceCodeVal;
	// 				// scanParams['invoiceNumber'] = invoiceNumVal;
	// 				// scanParams['billingDate'] = billingDateVal;
	// 				// scanParams['totalAmount'] = totalAmountVal;
	// 				// scanParams['checkCode'] = CheckCodeVal;
	// 				//发送查验请求
	// 				// check(scanParams);
	// 				$('#check_btn').trigger("click");
	// 			}, 10)
    //
	// 		}
    //
	// 	}
	// })

});

function errortxt(event, txt) {
	// console.log(event.parent().parent().siblings('.check_info_error').text(txt))
	event.parent().parent().siblings('.check_info_error').text(txt).show();
}

function errortxtEmpty(event) {
	event.parent().parent().siblings('.check_info_error').text('');
    event.parent().parent().siblings('.check_info_error').css('display','none');
}
//单条校验
function checks(checkNum) {
	// console.log(checkNum)
	if (checkNum == 1){
        invoiceCode = $.trim($("#invoiceCodeVal").val());
        //发票代码验证
        var reg = /^\d{10}$/,
            reg2 = /^\d{12}$/;
        // console.log(invoiceCode)
        if ( invoiceCode == "") {
            result = "发票代码不能为空!";
            errortxt( $("#invoiceCodeVal") ,result )
            return false
        }else if( (!reg.test(invoiceCode)) && (!reg2.test(invoiceCode)) ){
            result = "请输入10位或12位数字的发票代码!";
            errortxt( $("#invoiceCodeVal") ,result )
            return false
        } else {
            errortxtEmpty( $("#invoiceCodeVal") )
        }
	}else if (checkNum == 2){
        invoiceNumber = $.trim($("#invoiceNumVal").val());
        //发票号码验证
        reg = /^\d{8}$/;
        if ( invoiceNumber == "") {
            result = "发票号码不能为空!";
            errortxt( $("#invoiceNumVal") ,result )
            return false
        } else if ( !reg.test(invoiceNumber)){
            result = "请输入8位数字的发票号码!";
            errortxt( $("#invoiceNumVal") ,result )
            return false
        } else {
            errortxtEmpty( $("#invoiceNumVal") )
        }
	}else if (checkNum == 3){
        invoiceAmount = $("#totalAmountVal").val();
        //发票金额验证
        reg = /^(\-)?\d+(\.\d{1,2})?$/;
        if (invoiceAmount == "") {
            result = "发票金额不能为空!";
            errortxt( $("#totalAmountVal") ,result )
            return false
        }else if( !reg.test(invoiceAmount) ){
            result = "请输入正确的发票金额!";
            errortxt( $("#totalAmountVal") ,result )
            return false
        } else {
            errortxtEmpty( $("#totalAmountVal") )
        }
	}else if(checkNum == 4){
        invoiceCheckcode = $("#CheckCodeVal").val();
        //验证码后六位验证
        reg = /^\d{6}$/
        if (invoiceCheckcode == "") {
            result = "请填写校验码!";
            errortxt( $("#CheckCodeVal") ,result )
            return false
        } else if ( !reg.test(invoiceCheckcode) ){
            result = "请输6位数字校验码!";
            errortxt( $("#CheckCodeVal") ,result )
            return false
        }else {
            errortxtEmpty( $("#CheckCodeVal") )
        }
	}else{
        issueDate = $.trim($("#invoice_date_input").text());
        //发票日期验证
        reg = /^[1-2]{1}\d{3}-(\d{1}|0\d|1[0-2])-(\d|[0-2]\d|3[0-1])$/;
        // console.log($('#billingDateVal').val())
        if (!issueDate) {
            result = "发票日期不能为空!";
            errortxt( $("#billingDateVal") ,result )
            return false
        } else if (!reg.test(issueDate)){
            result = "请输入正确的发票日期(YYYY-MM-DD)!";
            errortxt( $("#billingDateVal") ,result )
            return false
        }else {
            errortxtEmpty( $("#billingDateVal") )
        }
	}
}
//校验
function verifyValues() {
	// console.log(1)
	invoiceCode = $.trim($("#invoiceCodeVal").val());
	invoiceNumber = $.trim($("#invoiceNumVal").val());
	issueDate = $.trim($("#invoice_date_input").text());
	invoiceAmount = $("#totalAmountVal").val();
	invoiceCheckcode = $("#CheckCodeVal").val();
    // console.log(issueDate)
    // console.log(invoiceCode)
    // console.log(invoiceNumber)
    // console.log(invoiceAmount)
    // console.log(invoiceCheckcode)
	//发票代码验证
	var reg = /^\d{10}$/,
		reg2 = /^\d{12}$/;
	// console.log(invoiceCode)
	if ( invoiceCode == "") {
		result = "发票代码不能为空!";
		errortxt( $("#invoiceCodeVal") ,result )
		return false
	}else if( (!reg.test(invoiceCode)) && (!reg2.test(invoiceCode)) ){
		result = "请输入10位或12位数字的发票代码!";
		errortxt( $("#invoiceCodeVal") ,result )
		return false
	} else {
		errortxtEmpty( $("#invoiceCodeVal") )
	}

	//发票号码验证
	reg = /^\d{8}$/;
	if ( invoiceNumber == "") {
		result = "发票号码不能为空!";
		errortxt( $("#invoiceNumVal") ,result )
		return false
	} else if ( !reg.test(invoiceNumber)){
		result = "请输入8位数字的发票号码!";
		errortxt( $("#invoiceNumVal") ,result )
		return false
	} else {
		errortxtEmpty( $("#invoiceNumVal") )
	}

	//发票金额验证
	// reg = /^([+-]?)((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/
	reg = /^(\-)?\d+(\.\d{1,2})?$/
	if (jeorjym) {
		//发票金额验证
		if (invoiceAmount == "") {
			result = "发票金额不能为空!";
			errortxt( $("#totalAmountVal") ,result )
			return false
		}else if( !reg.test(invoiceAmount) ){
			result = "请输入正确的发票金额!";
			errortxt( $("#totalAmountVal") ,result )
			return false
		} else {
			errortxtEmpty( $("#totalAmountVal") )
		}
	} else {
		//验证码后六位验证
		reg = /^\d{6}$/
		if (invoiceCheckcode == "") {
			result = "请填写校验码!";
			errortxt( $("#CheckCodeVal") ,result )
			return false
		} else if ( !reg.test(invoiceCheckcode) ){
			result = "请输6位数字校验码!";
			errortxt( $("#CheckCodeVal") ,result )
			return false
		}else {
			errortxtEmpty( $("#CheckCodeVal") )
		}
	}

	//发票日期验证
	reg = /^[1-2]{1}\d{3}-(\d{1}|0\d|1[0-2])-(\d|[0-2]\d|3[0-1])$/;
	// console.log($('#billingDateVal').val())
	if (!issueDate) {
		result = "发票日期不能为空!";
		errortxt( $("#billingDateVal") ,result )
		return false
	} else if (!reg.test(issueDate)){
		result = "请输入正确的发票日期(YYYY-MM-DD)!";
		errortxt( $("#billingDateVal") ,result )
		return false
	}else {
		errortxtEmpty( $("#billingDateVal") )
	}

	// return {
	// 	"invoiceCode": invoiceCode,
	// 	"invoiceNumber": invoiceNumber,
	// 	"billingDate": issueDate,
	// 	"totalAmount": invoiceAmount,
	// 	"checkCode": invoiceCheckcode
	// };
};

// function limitNumsOfAmount(obj) {
// 	var invoiceAmount = $.trim($(obj).val());
// 	var length = invoiceAmount.length;
// 	if (invoiceAmount.length > 10) {
// 		var rep = /[\.]/;
// 		var reg1 = /^[-]/;
// 		if (!reg1.test(invoiceAmount) && (!rep.test(invoiceAmount))) {
// 			invoiceAmount = invoiceAmount.substr(0, 10);
// 		} else if (reg1.test(invoiceAmount) && (!rep.test(invoiceAmount))) {
// 			invoiceAmount = invoiceAmount.substr(0, 11);
// 		}
// 		;
// 	}
// 	var pointNum = invoiceAmount.split(".")[1];
// 	if (pointNum) {
// 		pointNum = pointNum.substr(0, 2);
// 		invoiceAmount = invoiceAmount.split(".")[0] + "." + pointNum;
// 	}
// 	$(obj).val(invoiceAmount);
// 	return invoiceAmount;
// }
