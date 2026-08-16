import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { calculate } from '@/lib/money';
import { getSession } from '@/lib/auth';

const schema = z.object({
  kind: z.enum(['SALE', 'PURCHASE']),
  partyId: z.string().min(1),
  taxType: z.enum(['INTRA_STATE', 'INTER_STATE']),
  freight: z.number().min(0).default(0),
  vehicleNo: z.string().optional(),
  transporterId: z.string().optional(),
  lines: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().positive(),
        rate: z.number().min(0),
        discount: z.number().min(0).default(0),
      })
    )
    .min(1),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const input = schema.parse(await req.json());
    const items = await db.item.findMany({
      where: { id: { in: input.lines.map((x) => x.itemId) } },
    });

    if (items.length !== input.lines.length) {
      throw new Error('One or more items no longer exist');
    }

    const enriched = input.lines.map((line) => {
      const item = items.find((x) => x.id === line.itemId)!;
      return { ...line, gstRate: Number(item.gstRate), item };
    });

    if (input.kind === 'SALE') {
      const missing = enriched.find((x) => Number(x.item.currentStock) < x.quantity);
      if (missing) throw new Error(`Insufficient stock for ${missing.item.name}`);
    }

    const totals = calculate(enriched, input.taxType, input.freight);
    const prefix = input.kind === 'SALE' ? 'INV' : 'PUR';

    const invoice = await db.$transaction(async (tx) => {
      const count = await tx.invoice.count({ where: { kind: input.kind } });

      const created = await tx.invoice.create({
        data: {
          number: `${prefix}-${String(count + 1).padStart(5, '0')}`,
          kind: input.kind,
          status: 'POSTED',
          customerId: input.kind === 'SALE' ? input.partyId : null,
          supplierId: input.kind === 'PURCHASE' ? input.partyId : null,
          taxType: input.taxType,
          freight: input.freight,
          vehicleNo: input.vehicleNo,
          transporterId: input.transporterId,
          subtotal: totals.subtotal,
          cgst: totals.cgst,
          sgst: totals.sgst,
          igst: totals.igst,
          total: totals.total,
          notes: input.notes,
          createdById: session.id,
          lines: {
            create: enriched.map((x) => {
              const taxable = x.quantity * x.rate - x.discount;
              const tax = (taxable * x.gstRate) / 100;
              return {
                itemId: x.itemId,
                quantity: x.quantity,
                rate: x.rate,
                discount: x.discount,
                gstRate: x.gstRate,
                taxableAmount: taxable,
                taxAmount: tax,
                lineTotal: taxable + tax,
              };
            }),
          },
        },
      });

      for (const x of enriched) {
        const qty = input.kind === 'SALE' ? -x.quantity : x.quantity;
        const item = await tx.item.update({
          where: { id: x.itemId },
          data: { currentStock: { increment: qty } },
        });

        await tx.stockMovement.create({
          data: {
            itemId: x.itemId,
            invoiceId: created.id,
            type: input.kind === 'SALE' ? 'SALE' : 'PURCHASE',
            quantity: qty,
            balanceAfter: item.currentStock,
          },
        });
      }

      return created;
    });

    return NextResponse.json({
      invoiceId: invoice.id,
      number: invoice.number,
      invoice: JSON.parse(JSON.stringify(invoice)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to post invoice' },
      { status: 400 }
    );
  }
}