export function buildEwayBillJSON(params: {
  invoice: any;
  company: any;
  customer: any;
  lines: any[];
}) {
  const { invoice, company, customer, lines } = params;

  return {
    supplyType: 'O',
    subSupplyType: '1',
    docType: 'INV',
    docNo: invoice?.number?.toString() ?? '',
    docDate: invoice?.issueDate
      ? new Date(invoice.issueDate).toLocaleDateString('en-GB')
      : '',
    fromGstin: company?.gstin?.toString() ?? '',
    fromTrdName: company?.name?.toString() ?? '',
    fromAddr1: company?.address?.toString() ?? '',
    fromPlace: company?.city?.toString() ?? '',
    fromPincode: Number(company?.pincode) || 0,
    fromStateCode: Number(company?.stateCode) || 33,
    
    toGstin: customer?.gstin?.toString() ?? 'URP',
    toTrdName: customer?.name?.toString() ?? '',
    toAddr1: customer?.address?.toString() ?? '',
    toPlace: customer?.city?.toString() ?? '',
    toPincode: Number(customer?.pincode) || 0,
    toStateCode: Number(customer?.stateCode) || 33,

    totalValue: Number(invoice?.subtotal) || 0,
    cgstValue: Number(invoice?.cgst) || 0,
    sgstValue: Number(invoice?.sgst) || 0,
    igstValue: Number(invoice?.igst) || 0,
    totInvValue: Number(invoice?.total) || 0,

    transMode: invoice?.transMode?.toString() ?? '1',
    vehicleNo: invoice?.vehicleNo?.toString() ?? '',
    transporterId: invoice?.transporterId?.toString() ?? '',

    itemList: lines.map((line, index) => ({
      itemNo: index + 1,
      productName: line.item?.name?.toString() ?? '',
      productDesc: line.item?.description?.toString() ?? '',
      hsnCode: Number(line.item?.hsnCode) || 0,
      quantity: Number(line.quantity) || 0,
      qtyUnit: line.item?.unit?.toString() ?? 'NOS',
      taxableAmount: Number(line.lineTotal) || 0,
      sgstRate: Number(line.gstRate) / 2 || 0,
      cgstRate: Number(line.gstRate) / 2 || 0,
      igstRate: Number(line.gstRate) || 0,
    })),
  };
}