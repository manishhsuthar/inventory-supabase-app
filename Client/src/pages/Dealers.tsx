import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Plus, IndianRupee } from "lucide-react";

export default function Dealers() {
  const { dealers, addDealer, getDealerBalance, purchases, dealerPayments, addDealerPayment } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [payForm, setPayForm] = useState({ amount: "", note: "", date: new Date().toISOString().split("T")[0] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      await addDealer(form);
      setSubmitError(null);
      setForm({ name: "", phone: "", address: "" });
      setShowForm(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to add dealer");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayment || !payForm.amount) return;
    try {
      await addDealerPayment({ dealerId: showPayment, amount: Number(payForm.amount), note: payForm.note, date: payForm.date });
      setSubmitError(null);
      setPayForm({ amount: "", note: "", date: new Date().toISOString().split("T")[0] });
      setShowPayment(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to record payment");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dealers</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage suppliers and track payments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button hover:opacity-90 transition-all active:neu-button-active">
          <Plus className="h-4 w-4" /> Add Dealer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 neu-raised animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">New Dealer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NeuInput label="Dealer Name" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} required />
            <NeuInput label="Phone" value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} />
            <NeuInput label="Address" value={form.address} onChange={(v) => setForm(f => ({ ...f, address: v }))} />
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button active:neu-button-active">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium text-sm neu-button active:neu-button-active">Cancel</button>
          </div>
          {submitError && <p className="text-sm text-red-500 mt-3">{submitError}</p>}
        </form>
      )}

      {showPayment && (
        <form onSubmit={handlePayment} className="rounded-2xl bg-card p-6 neu-raised animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">Record Payment — {dealers.find(d => d.id === showPayment)?.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NeuInput label="Amount (₹)" type="number" value={payForm.amount} onChange={(v) => setPayForm(f => ({ ...f, amount: v }))} required />
            <NeuInput label="Date" type="date" value={payForm.date} onChange={(v) => setPayForm(f => ({ ...f, date: v }))} />
            <NeuInput label="Note" value={payForm.note} onChange={(v) => setPayForm(f => ({ ...f, note: v }))} />
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm neu-button active:neu-button-active">Record Payment</button>
            <button type="button" onClick={() => setShowPayment(null)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium text-sm neu-button active:neu-button-active">Cancel</button>
          </div>
          {submitError && <p className="text-sm text-red-500 mt-3">{submitError}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dealers.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full text-center py-8">No dealers yet.</p>
        ) : (
          dealers.map((d) => {
            const balance = getDealerBalance(d.id);
            const totalPurchased = purchases.filter(p => p.dealerId === d.id).reduce((s, p) => s + p.totalAmount, 0);
            const totalPaid = dealerPayments.filter(p => p.dealerId === d.id).reduce((s, p) => s + p.amount, 0);
            return (
              <div key={d.id} className="rounded-2xl bg-card p-5 neu-raised animate-fade-in">
                <h4 className="font-semibold text-foreground">{d.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{d.phone || "No phone"} · {d.address || "No address"}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Purchased</span><span className="font-medium text-foreground">₹{totalPurchased.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Paid</span><span className="font-medium text-foreground">₹{totalPaid.toLocaleString()}</span></div>
                  <div className="flex justify-between border-t border-border pt-2"><span className="text-muted-foreground font-medium">Balance</span><span className={`font-bold ${balance > 0 ? "text-destructive" : "text-primary"}`}>₹{balance.toLocaleString()}</span></div>
                </div>
                <button onClick={() => setShowPayment(d.id)} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground font-medium text-xs neu-button active:neu-button-active">
                  <IndianRupee className="h-3 w-3" /> Record Payment
                </button>
              </div>
            );
          })
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
