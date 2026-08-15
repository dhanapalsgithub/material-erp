import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { db } from '@/lib/db';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const invoice = await db.invoice.findUnique({
    where: { id: (await params).id },
    include: { customer: true, supplier: true, lines: { include: { item: true } } }
  });

  if (!invoice) return new Response('Not found', { status: 404 });

  const company = await db.company.findFirst();
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]),
        font = await pdf.embedFont(StandardFonts.Helvetica),
        bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  
  let y = 800;
  const line = (text: string, weight = false, size = 10) => {
    page.drawText(text, { x: 42, y, size, font: weight ? bold : font, color: rgb(.1, .15, .2) });
    y -= size + 7;
  };

  line(company?.name || 'BuildMart ERP', true, 18);
  line(`GSTIN: ${company?.gstin || '—'} | Tax Invoice`, false, 10);
  y -= 12;
  line(`Invoice No: ${invoice.number}`, true);
  line(`Date: ${new Date(invoice.issueDate).toLocaleDateString('en-IN')}`);
  line(`${invoice.kind === 'SALE' ? 'Bill To' : 'Supplier'}: ${(invoice.customer || invoice.supplier)?.name || '—'}`);
  line(`GSTIN: ${(invoice.customer || invoice.supplier)?.gstin || 'Unregistered'}`);
  y -= 12;
  
  line('Item                                               Qty         Rate         GST       Amount', true);
  page.drawLine({ start: { x: 42, y: y + 4 }, end: { x: 553, y: y + 4 }, thickness: 1 });
  
  for (const x of invoice.lines) {
    line(`${x.item.name.slice(0, 36).padEnd(40)} ${String(x.quantity).padStart(7)}  ${Number(x.rate).toFixed(2).padStart(10)}  ${String(x.gstRate).padStart(5)}%  ${Number(x.lineTotal).toFixed(2).padStart(10)}`);
  }
  
  y -= 8;
  line(`Taxable: ₹${Number(invoice.subtotal).toFixed(2)}`);
  line(`CGST: ₹${Number(invoice.cgst).toFixed(2)}  SGST: ₹${Number(invoice.sgst).toFixed(2)}  IGST: ₹${Number(invoice.igst).toFixed(2)}`);
  line(`Grand Total: ₹${Number(invoice.total).toFixed(2)}`, true, 13);
  line('Computer generated GST invoice. E-invoice IRN: ' + (invoice.eInvoiceIrn || 'Pending / not generated'), false, 8);

  const bytes = await pdf.save();
  
  // TypeScript பிழையைத் தவிர்க்க Blob-ஆக மாற்றி அனுப்பப்படுகிறது
  const blob = new Blob([bytes], { type: 'application/pdf' });

  return new Response(blob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoice.number}.pdf"`,
    },
  });
}