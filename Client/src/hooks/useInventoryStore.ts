import { useState, useEffect, useCallback } from "react";
import type { Product, Dealer, Purchase, Sale, DealerPayment } from "@/types/inventory";
import { getProducts, addProduct as createProduct } from "@/services/productService";
import { getDealers, addDealer as createDealer } from "@/services/dealerService";
import { getPurchases, addPurchase as createPurchase } from "@/services/purchaseService";
import { getSales, addSale as createSale } from "@/services/salesService";
import { getDealerPayments, addDealerPayment as createDealerPayment } from "@/services/dealerPaymentService";

type ProductRecord = {
  id: string;
  name: string;
  category?: string | null;
  cost_price: number;
  selling_price: number;
  min_stock: number;
  unit?: string | null;
  created_at: string;
};

type DealerRecord = {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  created_at: string;
};

type PurchaseRecord = {
  id: string;
  product_id: string;
  dealer_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  date: string;
  created_at: string;
};

type SaleRecord = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_name?: string | null;
  date: string;
  created_at: string;
};

type DealerPaymentRecord = {
  id: string;
  dealer_id: string;
  amount: number;
  date: string;
  note?: string | null;
  created_at: string;
};

const toProduct = (p: ProductRecord): Product => ({
  id: p.id,
  name: p.name,
  category: p.category || "",
  costPrice: Number(p.cost_price || 0),
  sellingPrice: Number(p.selling_price || 0),
  minStock: Number(p.min_stock || 0),
  unit: p.unit || "pcs",
  createdAt: p.created_at,
});

const toDealer = (d: DealerRecord): Dealer => ({
  id: d.id,
  name: d.name,
  phone: d.phone || "",
  address: d.address || "",
  createdAt: d.created_at,
});

const toPurchase = (p: PurchaseRecord): Purchase => ({
  id: p.id,
  productId: p.product_id,
  dealerId: p.dealer_id,
  quantity: Number(p.quantity || 0),
  unitPrice: Number(p.unit_price || 0),
  totalAmount: Number(p.total_amount || 0),
  date: p.date,
  createdAt: p.created_at,
});

const toSale = (s: SaleRecord): Sale => ({
  id: s.id,
  productId: s.product_id,
  quantity: Number(s.quantity || 0),
  unitPrice: Number(s.unit_price || 0),
  totalAmount: Number(s.total_amount || 0),
  customerName: s.customer_name || "",
  date: s.date,
  createdAt: s.created_at,
});

const toDealerPayment = (p: DealerPaymentRecord): DealerPayment => ({
  id: p.id,
  dealerId: p.dealer_id,
  amount: Number(p.amount || 0),
  date: p.date,
  note: p.note || "",
  createdAt: p.created_at,
});

export function useInventoryStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [dealerPayments, setDealerPayments] = useState<DealerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    setLoading(true);

    const [productsRes, dealersRes, purchasesRes, salesRes, paymentsRes] = await Promise.all([
      getProducts(),
      getDealers(),
      getPurchases(),
      getSales(),
      getDealerPayments(),
    ]);

    const firstError = productsRes.error || dealersRes.error || purchasesRes.error || salesRes.error || paymentsRes.error;
    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    setProducts(((productsRes.data || []) as ProductRecord[]).map(toProduct));
    setDealers(((dealersRes.data || []) as DealerRecord[]).map(toDealer));
    setPurchases(((purchasesRes.data || []) as PurchaseRecord[]).map(toPurchase));
    setSales(((salesRes.data || []) as SaleRecord[]).map(toSale));
    setDealerPayments(((paymentsRes.data || []) as DealerPaymentRecord[]).map(toDealerPayment));
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const addProduct = useCallback(async (p: Omit<Product, "id" | "createdAt">) => {
    const res = await createProduct({
      name: p.name,
      category: p.category,
      cost_price: p.costPrice,
      selling_price: p.sellingPrice,
      min_stock: p.minStock,
      unit: p.unit,
    });

    if (res.error || !res.data) {
      throw new Error(res.error?.message || "Failed to add product");
    }

    setProducts((prev) => [toProduct(res.data as ProductRecord), ...prev]);
  }, []);

  const addDealer = useCallback(async (d: Omit<Dealer, "id" | "createdAt">) => {
    const res = await createDealer(d);
    if (res.error || !res.data) {
      throw new Error(res.error?.message || "Failed to add dealer");
    }
    setDealers((prev) => [toDealer(res.data as DealerRecord), ...prev]);
  }, []);

  const addPurchase = useCallback(async (p: Omit<Purchase, "id" | "createdAt" | "totalAmount">) => {
    const res = await createPurchase({
      product_id: p.productId,
      dealer_id: p.dealerId,
      quantity: p.quantity,
      unit_price: p.unitPrice,
      date: p.date,
    });

    if (res.error || !res.data) {
      throw new Error(res.error?.message || "Failed to add purchase");
    }

    setPurchases((prev) => [toPurchase(res.data as PurchaseRecord), ...prev]);
  }, []);

  const addSale = useCallback(async (s: Omit<Sale, "id" | "createdAt" | "totalAmount">) => {
    const res = await createSale({
      product_id: s.productId,
      quantity: s.quantity,
      unit_price: s.unitPrice,
      customer_name: s.customerName,
      date: s.date,
    });

    if (res.error || !res.data) {
      throw new Error(res.error?.message || "Failed to add sale");
    }

    setSales((prev) => [toSale(res.data as SaleRecord), ...prev]);
  }, []);

  const addDealerPayment = useCallback(async (p: Omit<DealerPayment, "id" | "createdAt">) => {
    const res = await createDealerPayment({
      dealer_id: p.dealerId,
      amount: p.amount,
      date: p.date,
      note: p.note,
    });

    if (res.error || !res.data) {
      throw new Error(res.error?.message || "Failed to record payment");
    }

    setDealerPayments((prev) => [toDealerPayment(res.data as DealerPaymentRecord), ...prev]);
  }, []);

  const getProductStock = useCallback((productId: string) => {
    const totalIn = purchases.filter((p) => p.productId === productId).reduce((s, p) => s + p.quantity, 0);
    const totalOut = sales.filter((s) => s.productId === productId).reduce((s, sale) => s + sale.quantity, 0);
    return totalIn - totalOut;
  }, [purchases, sales]);

  const getDealerBalance = useCallback((dealerId: string) => {
    const totalPurchases = purchases.filter((p) => p.dealerId === dealerId).reduce((s, p) => s + p.totalAmount, 0);
    const totalPayments = dealerPayments.filter((p) => p.dealerId === dealerId).reduce((s, p) => s + p.amount, 0);
    return totalPurchases - totalPayments;
  }, [purchases, dealerPayments]);

  const getTotalOutstandingPayments = useCallback(() => {
    return dealers.reduce((total, d) => total + getDealerBalance(d.id), 0);
  }, [dealers, getDealerBalance]);

  const getLowStockProducts = useCallback(() => {
    return products.filter((p) => getProductStock(p.id) <= p.minStock);
  }, [products, getProductStock]);

  return {
    products,
    dealers,
    purchases,
    sales,
    dealerPayments,
    loading,
    error,
    refreshAll,
    addProduct,
    addDealer,
    addPurchase,
    addSale,
    addDealerPayment,
    getProductStock,
    getDealerBalance,
    getTotalOutstandingPayments,
    getLowStockProducts,
  };
}
