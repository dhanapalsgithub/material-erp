'use client';

import { useState } from 'react';

export default function EwayBillButton({ invoice }: { invoice: any }) {
  const [vehicleNo, setVehicleNo] = useState(invoice?.vehicleNo ?? '');
  const [transporterId, setTransporterId] = useState(invoice?.transporterId ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleGenerateEwayBill() {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ewaybill/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id ?? '',
          vehicleNo: vehicleNo ?? '',
          transporterId: transporterId ?? '',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // data.error object-ஆக இருந்தாலும் crash ஆகாமல் String-ஆக மாற்றுதல்
        const errorMessage = typeof data?.error === 'string'
          ? data.error
          : (data?.error?.message ? String(data.error.message) : 'Failed to generate E-Way Bill');
          
        setError(errorMessage);
        return;
      }

      const billNo = data?.ewayBillNo ? String(data.ewayBillNo) : 'Success';
      setSuccessMsg(`E-Way Bill Generated: ${billNo}`);
    } catch (err: any) {
      setLoading(false);
      const catchMsg = err?.message ? String(err.message) : 'An unexpected error occurred';
      setError(catchMsg);
    }
  }

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
      <h5 className="font-semibold text-sm text-slate-800">Generate E-Way Bill</h5>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">Vehicle No</label>
          <input
            type="text"
            className="w-full rounded border p-2 text-sm bg-white"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            placeholder="Vehicle Number"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-600">Transporter GSTIN</label>
          <input
            type="text"
            className="w-full rounded border p-2 text-sm bg-white"
            value={transporterId}
            onChange={(e) => setTransporterId(e.target.value)}
            placeholder="Transporter GSTIN"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {successMsg && <p className="text-xs text-green-600 font-semibold">{successMsg}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={handleGenerateEwayBill}
        className="w-full rounded-lg bg-teal-800 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-50"
      >
        {loading ? 'Submitting to NIC...' : 'Submit to NIC'}
      </button>
    </div>
  );
}