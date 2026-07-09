import { useMemo, useState } from 'react';
import ToolPageTemplate from '../../components/ToolPageTemplate';
import CopyButton from '../../components/CopyButton';
import { contactEmail, siteName } from '../../siteConfig';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

let nextItemId = 1;

function InvoiceGeneratorPage() {
  const [businessName, setBusinessName] = useState(`${siteName} Studio`);
  const [businessEmail, setBusinessEmail] = useState(contactEmail);
  const [clientName, setClientName] = useState('Client Name');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-0001');
  const [invoiceDate, setInvoiceDate] = useState(todayIso());
  const [items, setItems] = useState([
    { id: nextItemId++, description: 'Design and implementation support', qty: 1, price: 1250 },
  ]);

  function updateItem(id, field, value) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems((current) => [...current, { id: nextItemId++, description: '', qty: 1, price: 0 }]);
  }

  function removeItem(id) {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0),
    [items]
  );

  const invoiceText = useMemo(() => {
    const lines = [
      `${businessName}`,
      businessEmail,
      '',
      `Invoice #: ${invoiceNumber}`,
      `Date: ${invoiceDate}`,
      `Bill to: ${clientName}`,
      '',
      'Description | Qty | Amount',
      ...items.map((item) => `${item.description || 'Item'} | ${item.qty} | $${((Number(item.qty) || 0) * (Number(item.price) || 0)).toFixed(2)}`),
      '',
      `Total due: $${total.toFixed(2)}`,
    ];
    return lines.join('\n');
  }, [businessName, businessEmail, invoiceNumber, invoiceDate, clientName, items, total]);

  return (
    <ToolPageTemplate
      title="Invoice Generator"
      description="Create a simple invoice draft for freelance work, services, or client billing."
      metaDescription="Draft a simple invoice for a client, service, or freelance project."
      usageSteps={[
        'Add your business details, client name, and invoice number.',
        'List the items, quantities, and prices you want billed.',
        'Review the invoice preview, then copy the text or print it as a PDF.',
      ]}
      faqItems={[
        {
          question: 'Is this meant for professional invoicing?',
          answer: 'It is best for straightforward invoices and quick estimates rather than full accounting workflows.',
        },
        {
          question: 'Can I save it as a PDF?',
          answer: 'Use the "Print / Save as PDF" button and choose "Save as PDF" as the destination in your browser’s print dialog.',
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] print:block">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 print:hidden">
          <h2 className="text-lg font-semibold text-slate-900">Invoice details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Your business name</span>
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Your email</span>
              <input value={businessEmail} onChange={(event) => setBusinessEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Client name</span>
              <input value={clientName} onChange={(event) => setClientName(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Invoice #</span>
              <input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500" />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Date</span>
              <input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500" />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Line items</span>
              <button type="button" onClick={addItem} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white">
                + Add item
              </button>
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-[2fr_0.7fr_0.9fr_auto]">
                <input
                  value={item.description}
                  onChange={(event) => updateItem(item.id, 'description', event.target.value)}
                  placeholder="Description"
                  className="col-span-2 min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-500 sm:col-span-1"
                />
                <input
                  type="number"
                  min="0"
                  value={item.qty}
                  onChange={(event) => updateItem(item.id, 'qty', event.target.value)}
                  className="min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(event) => updateItem(item.id, 'price', event.target.value)}
                  className="min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
                />
                <button type="button" onClick={() => removeItem(item.id)} className="text-xs font-medium text-rose-600 hover:text-rose-700" disabled={items.length === 1}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={() => window.print()} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
              Print / Save as PDF
            </button>
            <CopyButton text={invoiceText} label="Copy invoice as text" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
          <h2 className="text-xl font-semibold text-slate-900 print:hidden">Invoice preview</h2>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:mt-0 print:border-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Invoice</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{businessName || 'Your Business'}</h3>
                <p className="mt-1 text-sm text-slate-600">{businessEmail}</p>
              </div>
              <div className="text-sm text-slate-600">
                <p><span className="font-medium text-slate-800">Invoice #:</span> {invoiceNumber}</p>
                <p><span className="font-medium text-slate-800">Date:</span> {invoiceDate}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Bill to</p>
                <p className="mt-2 text-slate-700">{clientName || 'Client Name'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Amount due</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">${total.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-[2fr_1fr_1fr] bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                <div>Description</div>
                <div>Qty</div>
                <div>Amount</div>
              </div>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                  <div className="truncate">{item.description || 'Item'}</div>
                  <div>{item.qty}</div>
                  <div>${((Number(item.qty) || 0) * (Number(item.price) || 0)).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
}

export default InvoiceGeneratorPage;
