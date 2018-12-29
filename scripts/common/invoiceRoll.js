//卷票
//清空发票全票面信息
function clearInvoiceDetail() {
    $('#invoiceTit').text('')
    $('#invoiceCode').text('')
    $('#invoiceNumber').text('')
    $('#billingDate').text('')
    $('#purchaserName').text('')
    $('#purchaserTaxNo').text('')
    $('#salesName').text('')
    $('#salesTaxNo').text('')
    $('#amountTaxCn').text('⊗')
    $('#amountTax').text('￥')
    $('#payee').text('')
    $('#machineCode').text('')
    $('#jdhm_invoiceNumber').text('')
    $('#checkCode').text('')
    //货物清单
    var $goodsDomCopy = $('.invoice_shop_list:first').clone(true); //拷贝出第一个
    //删除所有清单列表
    $('.invoice_shop_list').remove();
    //清空元素的值
    $goodsDomCopy.find('.commodityName').text('');
    $goodsDomCopy.find('.quantity').text('');
    $goodsDomCopy.find('.unitPrice').text('');
    $goodsDomCopy.find('.amount').text('');
    $('#statisticsRow').before($goodsDomCopy);
}
clearInvoiceDetail();
//设置全票面信息
function invoiceDetail(data) {
    $.extend(data, data.checkInvoice);

    $('#invoiceType').text('卷')
    $('#invoiceTit').text(data.invoiceType || '')
    $('#invoiceCode').text(data.invoiceCode || '')
    $('#invoiceNumber').text(data.invoiceNumber || '')
    var temDate = data.billingDate.split('-')
    $("#billingDate").text('').text( temDate[0]+'年'+temDate[1]+'月'+temDate[2]+'日' );
    $('#purchaserName').text(data.purchaserName || '')
    $('#purchaserTaxNo').text(data.purchaserTaxNo || '')
    $('#salesName').text(data.salesName || '')
    $('#salesTaxNo').text(data.salesTaxNo || '')
    $('#amountTaxCn').text('⊗'+data.amountTaxCn || '')
    $('#amountTax').text('￥'+data.amountTax || '')
    $('#payee').text(data.payee || '')
    $('#machineCode').text(data.machineCode || '')
    $('#jdhm_invoiceNumber').text(data.invoiceNumber || '')
    $('#checkCode').text(data.checkCode || '')
    //货物清单
    var goodsList = data.items;
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

                if(goods.unitPrice){
                    $goodsDom.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(8) || '');
                }else {
                    $goodsDom.find('.unitPrice').text('')
                }
                if(goods.quantity){
                    $goodsDom.find('.quantity').text( parseFloat(goods.quantity).toFixed(8) || '');
                }else {
                    $goodsDom.find('.quantity').text('')
                }

                // $goodsDom.find('.quantity').text( parseFloat(goods.quantity).toFixed(2) || '');
                $goodsDom.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');
            } else {
                var $goodsDomCopy = $('.invoice_shop_list:first').clone(true);
                $goodsDomCopy.find('.commodityName').text(goods.commodityName || '');
                // $goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(2) || '');
                // $goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(2) || '');
                if($goodsDomCopy.unitPrice){
                    $goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(8) || '');
                }else {
                    $goodsDomCopy.find('.unitPrice').text('')
                }
                if($goodsDomCopy.quantity){
                    $goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(8) || '');
                }else {
                    $goodsDomCopy.find('.quantity').text('')
                }

                $goodsDomCopy.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');

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
    $goodsDomCopy.find('.quantity').text('');
    $goodsDomCopy.find('.unitPrice').text('');
    $goodsDomCopy.find('.amount').text('');
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
            // $goodsDom.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(8) || '');
            // $goodsDom.find('.quantity').text( parseFloat(goods.quantity).toFixed(8) || '');
            if(goods.unitPrice){
                $goodsDom.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(8) || '');
            }else {
                $goodsDom.find('.unitPrice').text('')
            }
            if(goods.quantity){
                $goodsDom.find('.quantity').text( parseFloat(goods.quantity).toFixed(8) || '');
            }else {
                $goodsDom.find('.quantity').text('')
            }

            $goodsDom.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');
        } else {
            var $goodsDomCopy = $('.saleListRow:first').clone(true);
            $goodsDomCopy.find('.rowNo').text(i+1);
            $goodsDomCopy.find('.unit').text(goods.unit || '');
            // $goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(8) || '');
            // $goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(8) || '');
            if($goodsDomCopy.unitPrice){
                $goodsDomCopy.find('.unitPrice').text( parseFloat(goods.unitPrice).toFixed(8) || '');
            }else {
                $goodsDomCopy.find('.unitPrice').text('')
            }
            if($goodsDomCopy.quantity){
                $goodsDomCopy.find('.quantity').text( parseFloat(goods.quantity).toFixed(8) || '');
            }else {
                $goodsDomCopy.find('.quantity').text('')
            }

            $goodsDomCopy.find('.amount').text( parseFloat(goods.amount).toFixed(2) || '');

            $('#saleListStatisticsRow').before($goodsDomCopy);
        }

    }
}
