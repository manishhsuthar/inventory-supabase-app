import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Plus } from "lucide-react";

export default function Sales() {
  const { products, sales, addSale, getProductStock } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", quantity: "", unitPrice: "", customerName: "", date: new Date().toISOString().split("T")[0] });

  const selectedProduct = products.find(p => p.id === form.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.quantity || !form.unitPrice) return;
    const stock = getProductStock(form.productId);
    if (Number(form.quantity) > stock) {
      alert(`Insufficient stock! Available: ${stock}`);
      return;
    }
    addSale({
      productId: form.productId,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      customerName: form.customerName,
      date: form.date,
    });
    setForm({ productId: "", quantity: "", unitPrice: "", customerName: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales</h1>
          <p className="text-muted-foreground text-sm mt-1">Record stock-out to customers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button hover:opacity-90 transition-all active:neu-button-active">
          <Plus className="h-4 w-4" /> New Sale
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 neu-raised animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">Record Sale</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Product</label>
              <select value={form.productId} onChange={(e) => {
                const p = products.find(p => p.id === e.target.value);
                setForm(f => ({ ...f, productId: e.target.value, unitPrice: p ? String(p.sellingPrice) : f.unitPrice }));
              }} required className="w-full px-4 py-2.5 rounded-xl bg-background text-foreground text-sm neu-inset border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none">
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {getProductStock(p.id)})</option>)}
              </select>
            </div>
            <NeuInput label="Customer Name" value={form.customerName} onChange={(v) => setForm(f => ({ ...f, customerName: v }))} />
            <NeuInput label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm(f => ({ ...f, quantity: v }))} required />
            <NeuInput label="Selling Price (₹)" type="number" value={form.unitPrice} onChange={(v) => setForm(f => ({ ...f, unitPrice: v }))} required />
            <NeuInput label="Date" type="date" value={form.date} onChange={(v) => setForm(f => ({ ...f, date: v }))} />
            <div className="flex items-end">
              <div className="rounded-xl bg-muted p-3 neu-inset w-full text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-foreground">₹{((Number(form.quantity) || 0) * (Number(form.unitPrice) || 0)).toLocaleString()}</p>
                {selectedProduct && <p className="text-xs text-muted-foreground mt-1">Available: {getProductStock(selectedProduct.id)} {selectedProduct.unit}</p>}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button active:neu-button-active">Save Sale</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium text-sm neu-button active:neu-button-active">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-2xl bg-card p-6 neu-raised">
        {sales.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No sales recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium text-right">Qty</th>
                  <th className="pb-3 font-medium text-right">Price</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...sales].reverse().map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-muted-foreground">{s.date}</td>
                    <td className="py-3 font-medium text-foreground">{getProductName(s.productId)}</td>
                    <td className="py-3 text-muted-foreground">{s.customerName || "Walk-in"}</td>
                    <td className="py-3 text-right text-foreground">{s.quantity}</td>
                    <td className="py-3 text-right text-foreground">₹{s.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold text-foreground">₹{s.totalAmount.toLocaleString()}</td>
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
