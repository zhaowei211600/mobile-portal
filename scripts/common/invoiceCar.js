//机动车
//清空发票全票面信息
function clearInvoiceDetail() {
    $('#invoiceTit').text('')
    $('#invoiceCode').text('')
    $('#invoiceNumber').text('')
    $('#billingDate').text('')
    $('#jddm_invoiceCode').text('')
    $('#jdhm_invoiceNumber').text('')
    $('#machineCode').text('')
    $('#purchaserName').text('')
    $('#idCardNo').text('')
    $('#purchaserTaxNo').text('')
    $('#vehicleType').text('')
    $('#brandModel').text('')
    $('#originPlace').text('')
    $('#certificateNo').text('')
    $('#importCertificateNo').text('')
    $('#inspectionListNo').text('')
    $('#engineNo').text('')
    $('#vehicleNo').text('')
    $('#amountTaxCn').text('⊗')
    $('#amountTax').text('￥')
    $('#salesName').text('')
    $('#salesPhone').text('')
    $('#salesTaxNo').text('')
    $('#salesBankNo').text('')
    $('#salesAddress').text('')
    $('#salesBank').text('')
    $('#vatTaxRate').text('')
    $('#totalTax').text('')
    $('#TaxAuthorityName').text('')
    $('#totalAmount').text('￥')
    $('#Tonnage').text('')
    $('#passengersLimited').text('')
}
clearInvoiceDetail();
//设置全票面信息
function invoiceDetail(data) {
    $.extend(data, data.checkInvoice);
    $('#invoiceTit').text(data.invoiceType || '机动车销售统一发票')
    $('#invoiceCode').text(data.invoiceCode || '')
    $('#invoiceNumber').text(data.invoiceNumber || '')
    if (data.billingDate){
        var temDate = data.billingDate.split('-')
        $("#billingDate").text('').text( temDate[0]+'年'+temDate[1]+'月'+temDate[2]+'日' );
    }
    $('#jddm_invoiceCode').text(data.invoiceCode || '')
    $('#jdhm_invoiceNumber').text(data.invoiceNumber || '')
    $('#machineCode').text(data.machineCode || '')
    $('#purchaserName').text(data.purchaserName || '')
    $('#idCardNo').text(data.idCardNo || '')
    $('#purchaserTaxNo').text(data.purchaserTaxNo || '')
    $('#vehicleType').text(data.vehicleType || '')
    $('#brandModel').text(data.brandModel || '')
    $('#originPlace').text(data.originPlace || '')
    $('#certificateNo').text(data.certificateNo || '')
    $('#importCertificateNo').text(data.importCertificateNo || '')
    $('#inspectionListNo').text(data.inspectionListNo || '')
    $('#engineNo').text(data.engineNo || '')
    $('#vehicleNo').text(data.vehicleNo || '')
    $('#amountTaxCn').text('⊗' + data.amountTaxCn || '')
    $('#amountTax').text('￥' + data.amountTax || '')
    $('#salesName').text(data.salesName || '')
    $('#salesPhone').text(data.salesPhone || '')
    $('#salesTaxNo').text(data.salesTaxNo || '')
    $('#salesBankNo').text(data.salesBankNo || '')
    $('#salesAddress').text(data.salesAddress || '')
    $('#salesBank').text(data.salesBank || '')
    $('#vatTaxRate').text(data.vatTaxRate*100+'%' || '')
    $('#totalTax').text(data.totalTax || '')
    $('#taxAuthorityName').text(data.taxAuthorityName || '')
    $('#taxAuthorityNo').text(data.taxAuthorityNo || '')
    $('#totalAmount').text('￥'+data.totalAmount || '')
    $('#Tonnage').text(data.Tonnage || '')
    $('#passengersLimited').text(data.passengersLimited || '')
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
