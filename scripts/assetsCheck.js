//获取认证状态
//发票测试数据
// var params = {
// 	"invoiceCode": "3300164130",
// 	"invoiceNumber": "02983623",
// 	"billingDate": "2017-10-12",
// 	"totalAmount": "114034.04",
// 	"checkCode": "473805"
// }
//兼容safari浏览器 默认阻止浏览器的默认事件
// function onmouseupFn(eventTag) {
// 	var event = eventTag||window.event;
// 	event.preventDefault();
// };
// var timer = null, num = 0, ings = ['查验.', '查验..', '查验...'];
// $('#check_btn').click(function () {
//     clearInvoiceDetail();
//     $('.invoice_tc_wrap_type0,.invoice_tc_wrap_type1,.error_top_yellow,.error_top_red').hide()
//     $('.check_result_icon').hide();
//     if (verifyValues() != false) {
//         var params = {};
//         params['invoiceCode'] = invoiceCode;
//         params['invoiceNumber'] = invoiceNumber;
//         params['billingDate'] = issueDate;
//         params['totalAmount'] = invoiceAmount;
//         params['checkCode'] = invoiceCheckcode;
//         //加载中loading
//         // timer = setInterval(loading, 300)
//         // function loading() {
//         // 	num++;
//         // 	if (num > 2) {
//         // 		num = 0
//         // 	}
//         // 	$('#check').text(ings[num])
//         // };
//         //发送查验请求
//         check(params)
//     }
// });
getUserInfo(function (resp) {
	if (resp.returnCode == '200') {
		var approveState = resp.data.state;
		// console.log(approveState);
		if (approveState == 4) {
			$('.main_top_org').hide();
			//点击查验
			$('#check_btn').click(function () {
				clearInvoiceDetail();
				$('.invoice_tc_wrap_type0,.invoice_tc_wrap_type1,.error_top_yellow,.error_top_red').hide()
				$('.check_result_icon').hide();
				if (verifyValues() != false) {
					var params = {};
					params['invoiceCode'] = invoiceCode;
					params['invoiceNumber'] = invoiceNumber;
					params['billingDate'] = issueDate;
					params['totalAmount'] = invoiceAmount;
					params['checkCode'] = invoiceCheckcode;
					//加载中loading
					// timer = setInterval(loading, 300)
					// function loading() {
					// 	num++;
					// 	if (num > 2) {
					// 		num = 0
					// 	}
					// 	$('#check').text(ings[num])
					// };
					//发送查验请求
					check(params)
				}
			});
		} else {
			$('.main_top_org').show();
			$('#check_btn').click(function () {
				$('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
				// console.log('未认证，增加效果')
				setTimeout(function () {
					$('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
				}, 1000)
			});
		}
	}

});

//日期
// layui.use('laydate', function () {
// 	var laydate = layui.laydate;
// 	//日期
// 	laydate.render({
// 		elem: '#billingDateVal',
// 		theme: '#0080cc'
// 	});
// })

// $("#monitoring").attr('disable', false);
//输入框获取光标的时候默认选中
// $('.check_info_tab textarea').focus(function () {
// 	// var $this=$(this)
// 	// setTimeout(function () {
// 		$(this).select();
// 	// },0)
//
// })

var invoiceCode, invoiceNumber, issueDate, invoiceAmount, invoiceCheckcode;
var hy_num, jk_num, hy_data, jk_data, ok = 0, checkResult, monitorStatus, monitoringData, invoiceData;

//监控该张发票
// $("#monitoring").addClass("btn-disabled");
// $("#monitoring").click(function () {
// 	// console.log(1);
// 	monitoring(monitoringData);
// 	$("#monitoring").addClass("btn-disabled");
// });
// //票面信息与实际不符
// $("#invoice-info").addClass("btn-disabled");
// $("#invoice-info").click(function () {
// 	invoiceInfo(invoiceData);
// });

////发票核验
function check(params) {
	$.ajax({
		type: "post",
		url: BASEURL + "/invoice/check",
		data: JSON.stringify(params),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (data) {
			//清除loading
			// clearInterval(timer)
			// $('#check').text('查验')
			// console.log(data.data)
			if (data.returnCode == 200) {
				// invoiceDetail(data.data);
				// goodsData = data.data;
				invoiceShell = data.data;
				invoiceDetailShell(invoiceShell.invoiceTypeCode);
				setTimeout(function () {
					$.isFunction(invoiceDetail) && invoiceDetail(invoiceShell);
				},50)
				// goodsData = data.data;
				setTimeout(function () {
					switch (data.data.checkResult) {
						case '1':
							$('.check_result_icon').show();
							// $("#invoice-info").html("票面信息与实际一致");
							break;
						default:
							$('.check_result_icon').hide();
							// $("#invoice-info").html("票面信息与实际不符");
							break;
					}
				},55)
				ok = 0;
				$("#hy_list").empty();
				$("#jk_list").empty();
				// $("#monitoring").removeClass("btn-disabled");
				// $("#invoice-info").removeClass("btn-disabled");
				// $("#monitoring").css('background', '#0080CC');
				// $("#invoice-info").css("border", "1px solid #FF8F00");
				// $("#invoice-info").css("color", "#FF8F00");
				// $("#monitoring").hover(function () {
				// 	$("#monitoring").css('background', '#2EAAFF');
				// }, function () {
				// 	$("#monitoring").css('background', '#0080CC');
				// });
				// $("#invoice-info").hover(function () {
				// 	$("#invoice-info").css("border", "1px solid #FFB400");
				// 	$("#invoice-info").css("color", "#FFB400");
				// }, function () {
				// 	$("#invoice-info").css("border", "1px solid #FF8F00");
				// 	$("#invoice-info").css("color", "#FF8F00");
				// });
				// checkResult = data.checkResult;
                // monitorStatus = data.data.monitorStatus;
                // monitoringData = data.data;
                // invoiceData = data;
                // if (monitorStatus == "0") {
                // 	$("#monitoring").html("监控中...");
                // 	$("#monitoring").addClass("btn-disabled");
                // } else {
                // 	$("#monitoring").removeClass("btn-disabled");
                // 	$("#monitoring").html("监控该张发票");
                // }
                // switch (data.checkResult) {
                // 	case '1':
                // 		$('.check_result_icon').show();
                // 		$("#invoice-info").html("票面信息与实际一致");
                // 		break;
                // 	default:
                // 		$('.check_result_icon').hide();
                // 		$("#invoice-info").html("票面信息与实际不符");
                // 		break;
                // }
				hyrecord(data.data);//核验轨迹
				jkrecord(data.data);//监控轨迹
			}
			switch (data.returnType) {
				case '0':
					// $('.invoice_tc_wrap_type0 .checkout_txt_result').text( (data.returnMessage).replace(/\r?\n/g,"<br />") )
					$('.invoice_tc_wrap_type0 .checkout_txt_note').html((data.showMessage).replace(/\r?\n/g, "<br />"))
					$('.invoice_tc_wrap_type0').show();
					// $('.invoice_tc_wrap').eq(0).show();
					// $('.invoice_tc_wrap').eq(0).children('.checkout_txt').text(data.showMessage)
					break;
				case '1':
					$('.invoice_tc_wrap_type1 .checkout_txt_result').text((data.returnMessage).replace(/\r?\n/g, "<br />"))
					$('.invoice_tc_wrap_type1 .checkout_txt_note').html((data.showMessage).replace(/\r?\n/g, "<br />"))
					$('.invoice_tc_wrap_type1').show();
					break;
				case '2':
					$('.error_top_red').text(data.showMessage).show();
					break;
				case '3':
					$('.error_top_yellow').text(data.showMessage).show();
					break;
				default:
					$('.invoice_tc_wrap,.error_top_red,.error_top_yellow').hide()
					console.log(data.returnMessage)
					break;
			}
		},
		error: function (data) {
			// console.log(data);
			// console.log(data.returnMessage)
		}
	});

}

//全部轨迹
// function zcTrack() {
// 	$("#track").css("display", "block");
// }

// function monitoring(item) {
// 	var params = [];
// 	var params1 = {
// 		invoiceAssetId: item.invoiceAssetId,
// 		invoiceCode: item.invoiceCode,
// 		invoiceNumber: item.invoiceNumber,
// 		invoiceType: item.invoiceTypeCode
// 	};
// 	params.push(params1);
// 	$.ajax({
// 		url: BASEURL + "/invoice/monitor/insert",
// 		data: JSON.stringify(params),
// 		type: "post",
// 		contentType: "application/json",
// 		dataType: "json",
// 		success: function (data) {
// 			layui.use('layer', function () {
// 				var layer = layui.layer;
// 				if (data.returnCode == "517") {
// 					$("#details-btn").hide();
// 					$("#details-btns").show();
// 					$("#layer-content").html("此账户未认证，是否前往认证？");
//
// 				} else if (data.returnCode == 200) {
// 					$("#details-btns").hide();
// 					$("#details-btn").show();
// 					$("#layer-content").html("当前资产已开始监控，监控详情可进入监控管理查询");
// 					$("#monitoring").html("监控中...");
// 					$("#monitoring").addClass("btn-disabled");
// 				} else if (data.returnCode == 203) {
// 					$("#details-btns").hide();
// 					$("#details-btn").show();
// 					$("#layer-content").html("该资产已被进入监控池，请勿重复监控");
// 				} else {
// 					$("#details-btns").hide();
// 					$("#details-btn").show();
// 					$("#layer-content").html("监控失败");
// 				}
// 				layer.open({
// 					type: 1,
// 					content: $("#details"),
// 					title: false,
// 					area: ["350px", "220px"]
// 				});
// 				$("#layer-btn").click(function () {
// 					layer.closeAll();
// 				});
// 				$("#cancel-btn").click(function () {
// 					layer.closeAll();
// 				});
// 				$("#confirm-btn").click(function () {
// 					window.location.href = '/org/assets-manager/pages/userApply.html?ln=1';
// 					layer.closeAll();
// 				});
// 			});
// 			$("#monitoring").removeClass("btn-disabled");
// 		}
// 	});
// }

// function invoiceInfo(item) {
// 	console.log(checkResult);
// 	if (checkResult == "0") {
// 		checkResult = "1";
// 	}
// 	else {
// 		checkResult = "0";
// 	}
// 	var params = {
// 		invoiceCode: item.data.invoiceCode,
// 		invoiceNumber: item.data.invoiceNumber,
// 		checkResult: checkResult
// 	};
// 	// console.log(params);
// 	$.ajax({
// 		url: BASEURL + "/invoice/updateCheckStatus",
// 		data: JSON.stringify(params),
// 		type: "post",
// 		contentType: "application/json",
// 		dataType: "json",
// 		success: function (data) {
// 			switch (checkResult) {
// 				case '1':
// 					$('.check_result_icon').show();
// 					$("#invoice-info").html("票面信息与实际一致");
// 					break;
// 				default:
// 					$('.check_result_icon').hide();
// 					$("#invoice-info").html("票面信息与实际不符");
// 					break;
// 			}
// 			// switch (data.returnCode) {
// 			//     case '200':
// 			//         if (checkResult == "0") {
// 			//             checkResult = "1";
// 			//         } else {
// 			//             checkResult = "0";
// 			//         }
// 			// }
// 			// if (item.checkResult == "0"){
// 			//
// 			// }
// 		}
// 	});
// }

//核验记录
function hyrecord(item) {
	// var invoiceAssetId = item.invoiceAssetId;
	var hy_num1;
	var params = {
		invoiceCode: item.invoiceCode,
		invoiceNumber: item.invoiceNumber
	};
	$.ajax({
		url: BASEURL + "/invoice//user/check_count_by_org",
		data: JSON.stringify(params),
		type: "post",
		contentType: "application/json",
		dataType: "json",
		success: function (data) {
			switch (data.returnCode) {
				case '200':
					hy_data = data.data;
					hy_num = data.data.length;
					hy_num1 = data.total;
					break;
				default:
					hy_data = [];
					hy_num = 0;
					hy_num1 = 0;
					break;
			}
			ok += 1;
			if (ok == 2) {
				var gj_num, a = 0, b = 0;
				gj_num = hy_num + jk_num;
				$("#gj-record").html(gj_num);
				// console.log(hy_num);
				// console.log(jk_num);
				if (hy_num <= 2 && jk_num <= 2) {
					a = hy_num;
					b = jk_num;
				} else if (hy_num <= 2 && jk_num > 2) {
					a = hy_num;
					b = b <= (4 - a) ? jk_num : (4 - a);
				} else if (hy_num > 2 && jk_num <= 2) {
					b = jk_num;
					a = a <= (4 - b) ? (4 - b) : hy_num;
					// console.log(a);
					// console.log(b);
				} else {
					a = 2;
					b = 2;
				}
				// console.log(1);
				for (var i = 0; i < a; i++) {
					$("#hy_list").append("<li><p class='check_result_right_list_num'>" + hy_data[i].abnormalMessage + "</p></li>");
					// console.log(a);
					// console.log(b);
				}
				for (var j = 0; j < b; j++) {
					$("#jk_list").append("<li><p class='check_result_right_list_num'>" + jk_data[j].abnormalMessage + "</p></li>");
				}
				for (var m = 0; m < hy_data.length; m++) {
					$("#hy_list1").append("<li><p class='check_result_right_list_num'>" + hy_data[m].abnormalMessage + "</p></li>");
				}
				for (var n = 0; n < jk_data.length; n++) {
					$("#jk_list1").append("<li><p class='check_result_right_list_num'>" + jk_data[n].abnormalMessage + "</p></li>");
				}
			}
			switch (data.returnCode) {
				case '200':
					// hy_num = data.data.length;
					hy_num1 = data.total;
					break;
				default:
					// hy_num = 0;
					hy_num1 = 0;
					break;
			}
			$("#hy-record").html(hy_num1);
			$("#hy-record1").html(hy_num1);
			// ok = 0;
		}
	});
}

//全部轨迹
$("#zc-track").hover(function () {
	// layer.closeAll();
	if (ok == 2) {
		// console.log(ok);
		// console.log(hy_data);
		// zcTrack();
	}
}, function () {
	$("#track").css("display", "none");
});

//监控记录
function jkrecord(item) {
	// var invoiceAssetId = item.invoiceAssetId;
	var jk_num1;
	var params = {
		invoiceCode: item.invoiceCode,
		invoiceNumber: item.invoiceNumber
	};
	$.ajax({
		url: BASEURL + "/invoice//user/monitor_count_by_org",
		data: JSON.stringify(params),
		type: "post",
		contentType: "application/json",
		dataType: "json",
		success: function (data) {
			switch (data.returnCode) {
				case '200':
					jk_data = data.data;
					jk_num = data.data.length;
					jk_num1 = data.total;
					break;
				default:
					jk_data = [];
					jk_num = 0;
					jk_num1 = 0;
					break;
			}           // console.log(data);
			ok += 1;
			// console.log(data.data.length);
			if (ok == 2) {
				// console.log(ok);
				// console.log(hy_num);
				// console.log(jk_num);
				var gj_num, a = 0, b = 0;
				gj_num = hy_num + jk_num;
				$("#gj-record").html(gj_num);
				if (hy_num <= 2 && jk_num <= 2) {
					a = hy_num;
					b = jk_num;
				} else if (hy_num <= 2 && jk_num > 2) {
					a = hy_num;
					b = b <= (4 - a) ? jk_num : (4 - a);
				} else if (hy_num > 2 && jk_num <= 2) {
					b = jk_num;
					a = a <= (4 - b) ? (4 - b) : hy_num;
					// console.log(a);
					// console.log(b);
				} else {
					a = 2;
					b = 2;
				}
				// console.log(a);
				// console.log(b);
				for (var i = 0; i < a; i++) {
					$("#hy_list").append("<li><p class='check_result_right_list_num'>" + hy_data[i].abnormalMessage + "</p></li>");
					// console.log(a);
					// console.log(b);
				}
				for (var j = 0; j < b; j++) {
					$("#jk_list").append("<li><p class='check_result_right_list_num'>" + jk_data[j].abnormalMessage + "</p></li>");
				}
				for (var m = 0; m < hy_data.length; m++) {
					$("#hy_list1").append("<li><p class='check_result_right_list_num'>" + hy_data[m].abnormalMessage + "</p></li>");
				}
				for (var n = 0; n < jk_data.length; n++) {
					$("#jk_list1").append("<li><p class='check_result_right_list_num'>" + jk_data[n].abnormalMessage + "</p></li>");
				}
			}
			switch (data.returnCode) {
				case '200':
					// jk_num = data.data.length;
					jk_num1 = data.total;
					break;
				default:
					// jk_num = 0;
					jk_num1 = 0;
					break;
			}
			$("#jk-record").html(jk_num1);
			$("#jk-record1").html(jk_num1);
		}
	});
}

//发票查验结果提示蒙层
$(function () {
	$('.invoice_tc_wrap .invoice_tc_close').click(function () {
		$(this).parents('.invoice_tc_wrap').hide();
	})
})


