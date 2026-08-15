import { db } from '@/lib/db';
import InvoiceForm from '@/components/invoice-form';

export default async function Purchases() {
  const [rawItems, suppliers] = await Promise.all([
    db.item.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
    db.supplier.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  // அனைத்து Decimal மதிப்புகளையும் Number-ஆக மாற்றுதல்
  const items = rawItems.map((item) => ({
    ...item,
    gstRate: Number(item.gstRate),
    purchaseRate: Number(item.purchaseRate),
    sellingRate: Number(item.sellingRate),
    reorderLevel: Number(item.reorderLevel),
    currentStock: Number(item.currentStock),
  }));

  return (
    <>
      <h1 className="text-2xl font-bold">Purchase entry</h1>
      <p className="mt-1 text-sm text-slate-500">
        Posting a purchase increases stock automatically.
      </p>
      <InvoiceForm kind="PURCHASE" items={items} parties={suppliers} />
    </>
  );
}