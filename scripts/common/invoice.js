//普票 专票 电票
// 全票面加载
var goodsData = {};
// $('#invoiceFull').load('/assets-manager/html/invoice.html',function () {
//     clearInvoiceDetail()
// });

// Invoice DataModal
/*
{
    "returnCode": "200",
    "returnMessage": "请求成功",
    "data": {
        "yearCount": 0,
        "oneMonthCount": 0,
        "sixMonthCount": 0,
        "threeMonthCount": 0,
        "checkState": "0",
        "administrativeDivisionName": "河南",
        "invoiceTypeCode": "004",
        "invoiceType": "增值税专用发票",
        "invoiceCode": "4100154130",
        "invoiceNumber": "05045181",
        "billingDate": "2017-01-13",
        "salesName": "河南九州新亚酒店管理有限公司",
        "salesTaxNo": "91410100MA3X418E2G",
        "salesAddressPhone": "郑州市二七区二七路26号88827777",
        "salesBank": "建行郑州市二七路支行41050167690800000003",
        "purchaserName": "中金支付有限公司",
        "purchaserTaxNo": "91110102551443078Q",
        "purchaserAddressPhone": "北京市西城区平原里小区20号楼1-7/1-9/1-10  010-83548750",
        "purchaserBank": "建设银行北京右安门支行  11001071600053004514",
        "totalAmount": "754.72",
        "totalTax": "45.28",
        "amountTax": "800.00",
        "state": "0",
        "remarks": "",
        "checkCode": "",
        "carInfo": {
            "idCardNo": null,
            "vehicleType": null,
            "brandModel": null,
            "originPlace": null,
            "certificateNo": null,
            "inspectionListNo": null,
            "engineNo": null,
            "vehicleNo": null,
            "importCertificateNo": null,
            "paymentVoucherNo": null,
            "tonnage": null,
            "passengersLimited": null
        },
        "machineCode": "889905024946",
        "amountTaxCn": "捌佰圆整",
        "items": [
            {
                "rowNo": "1",
                "commodityName": "住宿费",
                "specificationModel": "",
                "unit": "",
                "quantity": "1.0000000",
                "unitPrice": "754.7169811",
                "amount": "754.72",
                "taxRate": "0.06",
                "tax": "45.28",
                "remark1": null,
                "remark2": null
            }
        ]
    }
}
*/
//清空发票全票面信息
function clearInvoiceDetail () {

    // invoiceCode = '';
    // invoiceNumber = '';
    // checkResult = '';

    $('#invoiceTypeCode').text('');
    $('#invoiceType').text('');
    $("#invoiceCode").text('');
    $("#invoiceNumber").text('');
    $("#checkCode").text('');
    $("#machineCode").text('');
    $("#billingDate").text('');

    //标记异常
    $('#invoiceState').removeClass('abnormal');
    // $('#markAbnormal').html('标为异常');

    //
    $('#invoiceTit').text('');
    $('.invoice_type').hide();

    //购方信息
    $("#purchaserName").text('');
    $("#purchaserTaxNo").text('');
    $("#purchaserAddressPhone").text('');
    $("#purchaserBank").text('');

    //货物清单
    var $goodsDomCopy = $('.invoice_shop_list:first').clone(true); //拷贝出第一个

    //删除所有清单列表
    $('.invoice_shop_list').remove();

    //清空元素的值
    $goodsDomCopy.find('.commodityName').text('');
    $goodsDomCopy.find('.specificationModel').text('');
    $goodsDomCopy.find('.unit').text('');
    $goodsDomCopy.find('.quantity').text('');
    $goodsDomCopy.find('.unitPrice').text('');
    $goodsDomCopy.find('.amount').text('');
    $goodsDomCopy.find('.taxRate').text('');
    $goodsDomCopy.find('.tax').text('');
    $('#statisticsRow').before($goodsDomCopy);

    //合计
    $('#totalAmount').text('￥');
    $('#totalTax').text('￥');
    // ⊗大写
    $('#amountTaxCn').text('⊗');
    $('#amountTax').html('￥');

    //销方信息
    $("#salesName").text('');
    $("#salesTaxNo").text('');
    $("#salesAddressPhone").text('');
    $("#salesBank").text('');

    //备注
    $("#remarks").text('');
};
clearInvoiceDetail();
// 设置发票全票面
function invoiceDetail (data) {

    clearInvoiceDetail();
    //去掉灰层

    //将checkInvoice里的字段拼接到data后面,便于直接访问checkInvoice里的属性
    $.extend(data, data.checkInvoice);

    $('.invoice_wrap').removeClass('invoice_gray');
    $('.invoice_type').show();
    // "invoiceTypeCode": 004 专  007 普 026 电
    // var invoiceTypeCode = '';
    var invoiceTit = '';
    var invoiceType = '';
    switch (data.invoiceTypeCode)
    {
        case '004':
        {
            invoiceType = '专';
            invoiceTit = '增值税专用发票';
            break;
        }
        case '007':
        {
            invoiceType = '普';
            invoiceTit = '增值税普通发票';
            break;
        }
        case '026':
        {
            invoiceType = '电';
            invoiceTit = '增值税电子普通发票';
            break;
        }
    }
    //查验是否票面信息相符 0一致 1不一致 null 没有比对过
    // switch (data.checkResult){
    //    case '1':
    //    	$('.check_result_icon').show();
    //    	break;
    //    default:
    //     $('.check_result_icon').hide();
    //    	break;
    // }
    // invoiceCode = data.invoiceCode;
    // invoiceNumber = data.invoiceNumber;
    // checkResult = data.checkResult;
    $('#invoiceTit').text('').text(data.administrativeDivisionName+invoiceTit || data.invoiceTit);
    $('#invoiceType').text('').text(invoiceType);
    // $('#invoiceType').text('').text(data.administrativeDivisionName + data.invoiceType);
    $("#invoiceCode").text('').text(data.invoiceCode || '');
    $("#invoiceNumber").text('').text(data.invoiceNumber || '');
    $("#checkCode").text('').text(data.checkCode  || '');
    $("#machineCode").text('').text(data.machineCode  || '');
    if (data.billingDate){
        var temDate = data.billingDate.split('-')
        $("#billingDate").text('').text( temDate[0]+'年'+temDate[1]+'月'+temDate[2]+'日' );
    }

    //标记异常
    // if(data.checkResult == 0) {
    //     $('#invoiceState').removeClass('abnormal');
    //     $('#markAbnormal').html('标为异常');
    // }else {
    //     $('#invoiceState').addClass('abnormal');
    //     $('#markAbnormal').html('取消异常');
    // }

    //购方信息
    $("#purchaserName").text('').text(data.purchaserName  || '');
    $("#purchaserTaxNo").text('').text(data.purchaserTaxNo  || '');
    $("#purchaserAddressPhone").text('').text(data.purchaserAddressPhone  || '');
    $("#purchaserBank").text('').text(data.purchaserBank  || '');

    //货物清单
    if (data.checkInvoiceDetailsList){
        var goodsList = data.checkInvoiceDetailsList;
        var count = goodsList.length;
        if (count <= 8) {
            //隐藏 详见货物清单 按钮
            $('#showGoodsListRow').hide();
            $('#saleListBox').hide()

            for (var i=0;i<count;i++) {
                var goods = goodsList[i];
                if (i == 0) {
                    var $goodsDom = $('.invoice_shop_list');
                    $goodsDom.find('.commodityName').text(goods.commodityName || '');
                    $goodsDom.find('.specificationModel').text(goods.specificationModel || '');
                    $goodsDom.find('.unit').text(goods.unit || '');
                    if (goods.quantity){
                        $goodsDom.find('.quantity').text( parseFloat(goods.quantity).toFixed(2));
                    }else {
                        $goodsDom.find('.quantity').text( '');

                    }

                    if (goods.unitPrice){
                        $goodsDom.find('.unitPrice').text( parseFloat(goods.unitPrice) );
                    }else {
                        $goodsDom.find('.unitPrice').text( '');
                    }

                    // $goodsDom.find('.quantity').text( parseInt(goods.quantity).toFixed(2) || '');
                    $goodsDom.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');
                    $goodsDom.find('.taxRate').text(goods.taxRate*100+'%' || '');
                    $goodsDom.find('.tax').text( parseFloat(goods.tax).toFixed(2) );
                } else {
                    var $goodsDomCopy = $('.invoice_shop_list:first').clone(true);
                    $goodsDomCopy.find('.commodityName').text(goods.commodityName || '');
                    $goodsDomCopy.find('.specificationModel').text(goods.specificationModel || '');
                    $goodsDomCopy.find('.unit').text(goods.unit || '');

                    if (goods.unitPrice){
                        $goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(2));
                    }else {
                        $goodsDomCopy.find('.unitPrice').text( '' );

                    }
                    //$goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(2) || '');
                    if (goods.quantity){
                        $goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(2) );
                    }else {
                        $goodsDomCopy.find('.quantity').text( '');
                    }
                    //$goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(2) || '');
                    $goodsDomCopy.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');
                    $goodsDomCopy.find('.taxRate').text(goods.taxRate*100+'%' || '');
                    $goodsDomCopy.find('.tax').text( parseFloat(goods.tax).toFixed(2) || '');

                    $('#statisticsRow').before($goodsDomCopy);
                }
            }
        } else {
            //显示 详见货物清单 按钮
            $('#showGoodsListRow').show();
            $('#saleListBox').show()
            clearListDetail();
            saleListDetail(invoiceShell)
        }
    }
    //合计
    $('#totalAmount').text('').text('￥'+data.totalAmount || '');
    $('#totalTax').text('').text('￥'+data.totalTax || '');
    // 大写
    $('#amountTaxCn').text('').text('⊗ '+data.amountTaxCn || '');
    $('#amountTax').text('').text('￥'+data.amountTax || '');

    //销方信息
    $("#salesName").text('').text(data.salesName || '');
    $("#salesTaxNo").text('').text(data.salesTaxNo || '');
    $("#salesAddressPhone").text('').text(data.salesAddressPhone || '');
    $("#salesBank").text('').text(data.salesBank || '');

    //备注
    $("#remarks").html(data.remarks);
    //发票状态
    //0-正常1-失控 2-作废 3-红冲 4-异常
    switch (data.state)
    {
        case '1':
        {
            $('#invoiceState').addClass('outcontrol')
            break;
        }
        case '2':
        {
            $('#invoiceState').addClass('void')
            break;
        }
        case '3':
        {
            $('#invoiceState').addClass('red')
            break;
        }
        case '4':
        {
            $('#invoiceState').addClass('abnormal')
            break;
        }
        default:
        {
            $('#invoiceState').removeClass('').addClass('invoice_state')
            break;
        }
    }

}
if (invoiceShell){
    invoiceDetail(invoiceShell)
}
//清空售货清单
function clearListDetail() {
    $('#saleListPurchaserName').text('');
    $('#saleListSalesName').text('');
    $('#saleListInvoiceCode').text('');
    $('#saleListInvoiceNumber').text('');
    $('#saleListBillingDate').text('');
    $('#saleListRemarks').text('');

    $('#saleListTotalAmount').text('');
    $('#saleListTax').text('');

    var $goodsDomCopy = $('.saleListRow:first').clone(true);

    //删除所有清单列表
    $('.saleListRow').remove();

    $goodsDomCopy.find('.rowNo').text('');
    $goodsDomCopy.find('.commodityName').text('');
    $goodsDomCopy.find('.specificationModel').text('');
    $goodsDomCopy.find('.unit').text('');
    $goodsDomCopy.find('.quantity').text('');
    $goodsDomCopy.find('.unitPrice').text('');
    $goodsDomCopy.find('.amount').text('');
    $goodsDomCopy.find('.taxRate').text('');
    $goodsDomCopy.find('.tax').text('');

    $('#saleListStatisticsRow').before($goodsDomCopy);

}
//售货清单赋值
function saleListDetail(data) {

    //先清除已有的dom元素
    clearListDetail();

    var temDate = data.billingDate.split('-')
    $("#saleListBillingDate").text('').text( temDate[0]+'年'+temDate[1]+'月'+temDate[2]+'日' );

    $('#saleListPurchaserName').text('').text(data.purchaserName || '');
    $('#saleListSalesName').text('').text(data.salesName || '');
    $('#saleListInvoiceCode').text('').text(data.invoiceCode || '');
    $('#saleListInvoiceNumber').text('').text(data.invoiceNumber || '');
    $('#saleListRemarks').text('').text(data.remarks || '');

    $('#saleListTotalAmount').text('').text(data.totalAmount || '');
    $('#saleListTax').text('').text(data.totalTax || '');

    var data = data.checkInvoiceDetailsList;
    var count = data.length;
    if(count == 0) return;

    for(var i = 0; i<count;i++) {
        var goods = data[i];
        if(i == 0) {
            var $goodsDom = $('.saleListRow');
            $goodsDom.find('.rowNo').text(i+1)
            $goodsDom.find('.commodityName').text(goods.commodityName || '');
            $goodsDom.find('.specificationModel').text(goods.specificationModel || '');
            $goodsDom.find('.unit').text(goods.unit || '');
            // $goodsDom.find('.quantity').text( parseInt(goods.quantity) || '');
            // $goodsDom.find('.unitPrice').text( parseFloat(goods.unitPrice) || '');
            if (goods.quantity){
                $goodsDom.find('.quantity').text( parseFloat(goods.quantity).toFixed(2));
            }else {
                $goodsDom.find('.quantity').text( '');

            }

            if (goods.unitPrice){
                $goodsDom.find('.unitPrice').text( parseFloat(goods.unitPrice) );
            }else {
                $goodsDom.find('.unitPrice').text( '');
            }

            $goodsDom.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');
            $goodsDom.find('.taxRate').text(goods.taxRate*100+'%' || '');
            $goodsDom.find('.tax').text( parseFloat(goods.tax).toFixed(2) || '' );
        } else {
            var $goodsDomCopy = $('.saleListRow:first').clone(true);
            $goodsDomCopy.find('.rowNo').text(i+1);
            $goodsDomCopy.find('.commodityName').text(goods.commodityName || '');
            $goodsDomCopy.find('.specificationModel').text(goods.specificationModel || '');
            $goodsDomCopy.find('.unit').text(goods.unit || '');
            if (goods.unitPrice){
                $goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(2));
            }else {
                $goodsDomCopy.find('.unitPrice').text( '' );

            }
            //$goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(2) || '');
            if (goods.quantity){
                $goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(2) );
            }else {
                $goodsDomCopy.find('.quantity').text( '');
            }
            //$goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(2) || '');
            $goodsDomCopy.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');
            $goodsDomCopy.find('.taxRate').text(goods.taxRate*100+'%' || '');
            $goodsDomCopy.find('.tax').text( parseFloat(goods.tax).toFixed(2) || '');

            $('#saleListStatisticsRow').before($goodsDomCopy);
        }

    }
}
