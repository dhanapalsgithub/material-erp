'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EwayBillButton from '@/components/ewaybill-button';

type Item = {
  id: string;
  name: string;
  sku: string;
  sellingRate: any;
  purchaseRate: any;
  gstRate: any;
  currentStock: any;
};

type Party = {
  id: string;
  name: string;
};

// 📦 மாதிரி பொருட்கள் (Fallback Dummy Data)
const MOCK_ITEMS: Item[] = [
  { id: 'item-1', name: 'OPC Cement 50 kg', sku: 'CEM-01', sellingRate: 380, purchaseRate: 340, gstRate: 28, currentStock: 500 },
  { id: 'item-2', name: 'PPC Cement 50 kg', sku: 'CEM-02', sellingRate: 360, purchaseRate: 320, gstRate: 28, currentStock: 350 },
  { id: 'item-3', name: 'TMT Steel Bar 12mm', sku: 'STL-12', sellingRate: 65000, purchaseRate: 58000, gstRate: 18, currentStock: 50 },
  { id: 'item-4', name: 'M-Sand (Per Unit)', sku: 'SND-01', sellingRate: 4500, purchaseRate: 3800, gstRate: 5, currentStock: 120 },
  { id: 'item-5', name: 'Red Bricks (1000 Pcs)', sku: 'BRK-01', sellingRate: 9000, purchaseRate: 7500, gstRate: 12, currentStock: 25 },
];

// 👥 மாதிரி வாடிக்கையாளர்கள் / சப்ளையர்கள் (Fallback Dummy Data)
const MOCK_PARTIES: Party[] = [
  { id: 'party-1', name: 'ABC Constructions' },
  { id: 'party-2', name: 'Sri Murugan Builders' },
  { id: 'party-3', name: 'Global Traders Pvt Ltd' },
  { id: 'party-4', name: 'Karthik Hardware Stores' },
  { id: 'party-5', name: 'Ravi Enterprise' },
];

export default function InvoiceForm({
  kind,
  items = [],
  parties = [],
}: {
  kind: 'SALE' | 'PURCHASE';
  items?: Item[];
  parties?: Party[];
}) {
  const router = useRouter();

  // Database-இல் தரவு இல்லையெனில் Dummy List-ஐப் பயன்படுத்தும்
  const activeItems = useMemo(() => (items.length > 0 ? items : MOCK_ITEMS), [items]);
  const activeParties = useMemo(() => (parties.length > 0 ? parties : MOCK_PARTIES), [parties]);

  const [partyId, setParty] = useState('');
  const [taxType, setTax] = useState<'INTRA_STATE' | 'INTER_STATE'>('INTRA_STATE');
  const [freight, setFreight] = useState(0);
  const [vehicleNo, setVehicleNo] = useState('');
  const [transporterId, setTransporterId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);

  // தொடக்க வரிசை (Initial Row)
  const [rows, setRows] = useState([
    {
      itemId: activeItems[0]?.id || '',
      quantity: 1,
      rate: Number(kind === 'SALE' ? activeItems[0]?.sellingRate : activeItems[0]?.purchaseRate) || 0,
      discount: 0,
    },
  ]);

  // Active items மாறும் போது row item ID-ஐ sync செய்ய
  useEffect(() => {
    if (activeItems.length > 0 && !rows[0]?.itemId) {
      setRows([
        {
          itemId: activeItems[0].id,
          quantity: 1,
          rate: Number(kind === 'SALE' ? activeItems[0].sellingRate : activeItems[0].purchaseRate) || 0,
          discount: 0,
        },
      ]);
    }
  }, [activeItems, kind]);

  // மொத்தத் தொகையைக் கணக்கிடுதல் (Total Calculation)
  const total = useMemo(
    () =>
      rows.reduce((s, r) => {
        const i = activeItems.find((x) => x.id === r.itemId);
        const lineTotal = (r.quantity * r.rate - r.discount) * (1 + Number(i?.gstRate || 0) / 100);
        return s + lineTotal;
      }, freight),
    [rows, freight, activeItems]
  );

  // வரிசையின் மதிப்புகளைப் புதுப்பித்தல்
  function update(i: number, key: string, value: string) {
    if (key === 'itemId') {
      const item = activeItems.find((x) => x.id === value);
      setRows((r) =>
        r.map((x, n) =>
          n === i
            ? {
                ...x,
                itemId: value,
                rate: Number(kind === 'SALE' ? item?.sellingRate : item?.purchaseRate) || 0,
              }
            : x
        )
      );
    } else {
      setRows((r) =>
        r.map((x, n) => (n === i ? { ...x, [key]: Number(value) } : x))
      );
    }
  }

  // பில் தகவலைச் சேமித்தல்
  async function submit() {
    setError('');

    if (!partyId) {
      setError(`Please select a valid ${kind === 'SALE' ? 'customer' : 'supplier'}.`);
      return;
    }

    // Database-இல் இல்லாத Dummy Party ID தேர்வு செய்யப்பட்டிருந்தால் எச்சரிக்கை
    const isMockParty = MOCK_PARTIES.some((p) => p.id === partyId) && parties.length === 0;
    if (isMockParty) {
      setError('Cannot save invoice with mock data. Please create a real customer/supplier in database first.');
      return;
    }

    setLoading(true);

    try {
      const r = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          partyId,
          taxType,
          freight,
          vehicleNo,
          transporterId,
          lines: rows,
        }),
      });

      const out = await r.json();
      setLoading(false);

      if (!r.ok) {
        setError(out.error || 'Failed to post invoice');
        return;
      }

      // E-Way Bill-க்குத் தேவையான அனைத்து தரவுகளையும் சரியாக அனுப்புதல்
      setCreatedInvoice(
        out.invoice || {
          id: out.invoiceId || out.id,
          total,
          vehicleNo: vehicleNo ?? '',
          transporterId: transporterId ?? '',
        }
      );
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Something went wrong');
    }
  }

  return (
    <section className="card mt-5 p-6 bg-white rounded-xl shadow-sm border">
      {/* 1. மேலடுக்கு விவரங்கள் (Top Controls) */}
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">
            Select {kind === 'SALE' ? 'Customer' : 'Supplier'}
          </label>
          <select
            className="w-full rounded border p-2 text-sm"
            value={partyId}
            onChange={(e) => setParty(e.target.value)}
          >
            <option value="">Select {kind === 'SALE' ? 'customer' : 'supplier'}</option>
            {activeParties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">Tax Type</label>
          <select
            className="w-full rounded border p-2 text-sm"
            value={taxType}
            onChange={(e) => setTax(e.target.value as any)}
          >
            <option value="INTRA_STATE">Intra-state (CGST + SGST)</option>
            <option value="INTER_STATE">Inter-state (IGST)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">Freight (₹)</label>
          <input
            className="w-full rounded border p-2 text-sm"
            type="number"
            min="0"
            value={freight}
            onChange={(e) => setFreight(Number(e.target.value))}
            placeholder="Freight charges"
          />
        </div>
      </div>

      {/* 2. E-Way Bill / Transport விவரங்கள் */}
      <div className="mb-4 grid gap-3 md:grid-cols-2 bg-slate-50 p-3 rounded-lg border">
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">
            Vehicle No (Optional for E-Way Bill)
          </label>
          <input
            className="w-full rounded border p-2 text-sm bg-white"
            type="text"
            placeholder="e.g. MH12AB1234"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">
            Transporter GSTIN (Optional)
          </label>
          <input
            className="w-full rounded border p-2 text-sm bg-white"
            type="text"
            placeholder="Transporter GSTIN"
            value={transporterId}
            onChange={(e) => setTransporterId(e.target.value)}
          />
        </div>
      </div>

      {/* 3. பொருட்கள் அட்டவணை (Items Table) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-slate-100 text-slate-700">
              <th className="p-2">Item</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate (₹)</th>
              <th className="p-2">Discount (₹)</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const it = activeItems.find((x) => x.id === r.itemId);
              return (
                <tr key={i} className="border-b">
                  <td className="p-2">
                    <select
                      className="rounded border p-1 text-sm w-full"
                      value={r.itemId}
                      onChange={(e) => update(i, 'itemId', e.target.value)}
                    >
                      {activeItems.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 text-slate-500">{it ? String(it.currentStock) : '0'}</td>
                  <td className="p-2">
                    <input
                      className="w-20 rounded border p-1 text-sm"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={r.quantity}
                      onChange={(e) => update(i, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-24 rounded border p-1 text-sm"
                      type="number"
                      value={r.rate}
                      onChange={(e) => update(i, 'rate', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-20 rounded border p-1 text-sm"
                      type="number"
                      value={r.discount}
                      onChange={(e) => update(i, 'discount', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setRows(rows.filter((_, n) => n !== i))}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* புதிய வரிசை சேர்க்கும் பொத்தான் */}
      <button
        type="button"
        onClick={() =>
          setRows([
            ...rows,
            {
              itemId: activeItems[0]?.id || '',
              quantity: 1,
              rate: Number(kind === 'SALE' ? activeItems[0]?.sellingRate : activeItems[0]?.purchaseRate) || 0,
              discount: 0,
            },
          ])
        }
        className="mt-3 rounded border px-3 py-1 text-xs font-semibold hover:bg-slate-100"
      >
        + Add line
      </button>

      {/* கீழடுக்கு விவரங்கள் மற்றும் Submit பொத்தான் */}
      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-lg font-bold text-slate-800">
          Estimated total: ₹{total.toFixed(2)}
        </span>
        <button
          disabled={!partyId || !rows.length || loading}
          onClick={submit}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {loading ? 'Posting...' : `Post ${kind === 'SALE' ? 'sale' : 'purchase'}`}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

      {/* 🚚 பில் வெற்றி பெற்றதும் காட்சியளிக்கும் E-Way Bill பகுதி */}
      {createdInvoice && (
        <div className="mt-6 border-t pt-4 space-y-3">
          <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800 font-medium">
            ✅ Invoice posted successfully!
          </div>

          {kind === 'SALE' && (
            <div className="mt-2">
              <h4 className="font-semibold text-sm mb-2 text-slate-700">E-Way Bill Actions:</h4>
              <EwayBillButton invoice={createdInvoice} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}