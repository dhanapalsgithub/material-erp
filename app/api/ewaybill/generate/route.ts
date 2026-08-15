import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { invoiceId, vehicleNo, transporterId } = await req.json();

    // 1. Fetch invoice details from your DB
    // const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });

    // 2. Prepare Payload for ClearTax / GSP API
    const clearTaxPayload = [
      {
        userGstin: process.env.YOUR_GSTIN,
        supplyType: 'O', // Outward
        subSupplyType: '1', // Supply
        docType: 'INV',
        docNo: invoiceId,
        docDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
        fromGstin: process.env.YOUR_GSTIN,
        fromStateCode: 33, // Tamil Nadu
        toGstin: '33AAAAA0000A1Z5', // Customer GSTIN
        toStateCode: 33,
        totalValue: 10000,
        cgstValue: 900,
        sgstValue: 900,
        igstValue: 0,
        itemList: [
          {
            productName: 'Cement',
            hsnCode: 2523,
            quantity: 20,
            qtyUnit: 'BAG',
            taxableAmount: 10000,
            cgstRate: 9,
            sgstRate: 9,
          },
        ],
        transporterId: transporterId || '',
        vehicleNo: vehicleNo || '',
        vehicleType: 'R', // Regular
      },
    ];

    // 3. Request ClearTax API
    const response = await fetch('https://api-sandbox.clear.in/e-waybill/v2/generate', {
      method: 'PUT',
      headers: {
        'x-cleartax-auth-token': process.env.CLEARTAX_AUTH_TOKEN || '',
        'Content-Type': 'application/json',
        'gstin': process.env.YOUR_GSTIN || '',
      },
      body: JSON.stringify(clearTaxPayload),
    });

    const data = await response.json();

    if (!response.ok || data[0]?.errors) {
      return NextResponse.json(
        { error: data[0]?.errors?.[0]?.error_message || 'NIC API Error' },
        { status: 400 }
      );
    }

    // 4. Return Real E-Way Bill Number
    return NextResponse.json({
      success: true,
      ewayBillNo: data[0]?.govt_response?.ewayBillNo,
      ewayBillDate: data[0]?.govt_response?.ewayBillDate,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}