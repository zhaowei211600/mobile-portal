
//全票面类型获取加载
window.invoiceShell = ''
//  console.log(invoiceShell.invoiceTypeCode)

invoiceDetailShell(invoiceShell.invoiceTypeCode)

function  invoiceDetailShell(type) {

	if ( type =='004' || type =='007'  || type =='026' ){
		$('#invoiceFull').load('/wechat/src/html/invoice.html',function () {});
		// document.write('<script type="text/javascript" src="../scripts/utils/invoice.js"><\/script>')
		$('body').append('<script type="text/javascript" src="/wechat/src/scripts/common/invoice.js"><\/script>')
	}
	else if ( type == '025'){
		//卷票
		$('#invoiceFull').load('/wechat/src/html/invoiceRoll.html',function () {});
		$('body').append('<script type="text/javascript" src="/wechat/src/scripts/common/invoiceRoll.js"><\/script>')
	}else if ( type == '005'){
		//机动车
		$('#invoiceFull').load('/wechat/src/html/invoiceCar.html',function () {});
		$('body').append('<script type="text/javascript" src="/wechat/src/scripts/common/invoiceCar.js"><\/script>')
	}else if(type == '14'){
		//通行费
		$('#invoiceFull').load('/wechat/src/html/invoiceToll.html',function () {});
		$('body').append('<script type="text/javascript" src="/wechat/src/scripts/common/invoiceToll.js"><\/script>')
	}
	else {
		//默认普票
		$('#invoiceFull').load('/wechat/src/html/invoice.html',function () {});
	}
}

function listClose() {
	$('#saleListBox').hide()
}
$('body').on('click','#showGoodsListRow a',function () {
	$('#saleListBox').show()
	clearListDetail();
	saleListDetail(invoiceShell)
})

//测试数据
/*
通行费： 代码 011001700112  号码 14072028  校验码后六位 654687
电票    代码
 */
