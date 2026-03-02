import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Plus } from "lucide-react";

export default function Purchases() {
  const { products, dealers, purchases, addPurchase } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({ productId: "", dealerId: "", quantity: "", unitPrice: "", date: new Date().toISOString().split("T")[0] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.dealerId || !form.quantity || !form.unitPrice) return;
    try {
      await addPurchase({
        productId: form.productId,
        dealerId: form.dealerId,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        date: form.date,
      });
      setSubmitError(null);
      setForm({ productId: "", dealerId: "", quantity: "", unitPrice: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save purchase");
    }
  };

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || "Unknown";
  const getDealerName = (id: string) => dealers.find(d => d.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchases</h1>
          <p className="text-muted-foreground text-sm mt-1">Record stock-in from dealers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button hover:opacity-90 transition-all active:neu-button-active">
          <Plus className="h-4 w-4" /> New Purchase
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 neu-raised animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">Record Purchase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NeuSelect label="Product" value={form.productId} onChange={(v) => setForm(f => ({ ...f, productId: v }))} options={products.map(p => ({ value: p.id, label: p.name }))} required />
            <NeuSelect label="Dealer" value={form.dealerId} onChange={(v) => setForm(f => ({ ...f, dealerId: v }))} options={dealers.map(d => ({ value: d.id, label: d.name }))} required />
            <NeuInput label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm(f => ({ ...f, quantity: v }))} required />
            <NeuInput label="Unit Price (₹)" type="number" value={form.unitPrice} onChange={(v) => setForm(f => ({ ...f, unitPrice: v }))} required />
            <NeuInput label="Date" type="date" value={form.date} onChange={(v) => setForm(f => ({ ...f, date: v }))} />
            <div className="flex items-end">
              <div className="rounded-xl bg-muted p-3 neu-inset w-full text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-foreground">₹{((Number(form.quantity) || 0) * (Number(form.unitPrice) || 0)).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button active:neu-button-active">Save Purchase</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium text-sm neu-button active:neu-button-active">Cancel</button>
          </div>
          {submitError && <p className="text-sm text-red-500 mt-3">{submitError}</p>}
        </form>
      )}

      <div className="rounded-2xl bg-card p-6 neu-raised">
        {purchases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No purchases recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Dealer</th>
                  <th className="pb-3 font-medium text-right">Qty</th>
                  <th className="pb-3 font-medium text-right">Unit Price</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...purchases].reverse().map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-muted-foreground">{p.date}</td>
                    <td className="py-3 font-medium text-foreground">{getProductName(p.productId)}</td>
                    <td className="py-3 text-muted-foreground">{getDealerName(p.dealerId)}</td>
                    <td className="py-3 text-right text-foreground">{p.quantity}</td>
                    <td className="py-3 text-right text-foreground">₹{p.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold text-foreground">₹{p.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function NeuInput({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-background text-foreground text-sm neu-inset border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
    </div>
  );
}

function NeuSelect({ label, value, onChange, options, required = false }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-background text-foreground text-sm neu-inset border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none">
        <option value="">Select {label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
