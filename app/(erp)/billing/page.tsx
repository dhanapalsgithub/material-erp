import { db } from '@/lib/db';
import InvoiceForm from '@/components/invoice-form';

export default async function Billing() {
  const [rawItems, rawCustomers] = await Promise.all([
    db.item.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
    db.customer.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  // Prisma Decimal & Date புலங்களை Client Component-க்கு ஏற்றவாறு Plain Objects-ஆக மாற்றுதல்
  const items = JSON.parse(JSON.stringify(rawItems));
  const customers = JSON.parse(JSON.stringify(rawCustomers));

  return (
    <>
      <h1 className="text-2xl font-bold">Sales billing / POS</h1>
      <p className="mt-1 text-sm text-slate-500">
        Posting a sale validates and deducts stock automatically.
      </p>
      <InvoiceForm kind="SALE" items={items} parties={customers} />
    </>
  );
}