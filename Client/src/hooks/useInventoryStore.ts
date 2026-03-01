import { useState, useEffect, useCallback } from "react";
import type { Product, Dealer, Purchase, Sale, DealerPayment } from "@/types/inventory";

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

const uid = () => crypto.randomUUID();

export function useInventoryStore() {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage("inv_products", []));
  const [dealers, setDealers] = useState<Dealer[]>(() => loadFromStorage("inv_dealers", []));
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadFromStorage("inv_purchases", []));
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage("inv_sales", []));
  const [dealerPayments, setDealerPayments] = useState<DealerPayment[]>(() => loadFromStorage("inv_dealer_payments", []));

  useEffect(() => saveToStorage("inv_products", products), [products]);
  useEffect(() => saveToStorage("inv_dealers", dealers), [dealers]);
  useEffect(() => saveToStorage("inv_purchases", purchases), [purchases]);
  useEffect(() => saveToStorage("inv_sales", sales), [sales]);
  useEffect(() => saveToStorage("inv_dealer_payments", dealerPayments), [dealerPayments]);

  const addProduct = useCallback((p: Omit<Product, "id" | "createdAt">) => {
    setProducts(prev => [...prev, { ...p, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);

  const addDealer = useCallback((d: Omit<Dealer, "id" | "createdAt">) => {
    setDealers(prev => [...prev, { ...d, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);

  const addPurchase = useCallback((p: Omit<Purchase, "id" | "createdAt" | "totalAmount">) => {
    setPurchases(prev => [...prev, { ...p, id: uid(), totalAmount: p.quantity * p.unitPrice, createdAt: new Date().toISOString() }]);
  }, []);

  const addSale = useCallback((s: Omit<Sale, "id" | "createdAt" | "totalAmount">) => {
    setSales(prev => [...prev, { ...s, id: uid(), totalAmount: s.quantity * s.unitPrice, createdAt: new Date().toISOString() }]);
  }, []);

  const addDealerPayment = useCallback((p: Omit<DealerPayment, "id" | "createdAt">) => {
    setDealerPayments(prev => [...prev, { ...p, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);

  const getProductStock = useCallback((productId: string) => {
    const totalIn = purchases.filter(p => p.productId === productId).reduce((s, p) => s + p.quantity, 0);
    const totalOut = sales.filter(s => s.productId === productId).reduce((s, sale) => s + sale.quantity, 0);
    return totalIn - totalOut;
  }, [purchases, sales]);

  const getDealerBalance = useCallback((dealerId: string) => {
    const totalPurchases = purchases.filter(p => p.dealerId === dealerId).reduce((s, p) => s + p.totalAmount, 0);
    const totalPayments = dealerPayments.filter(p => p.dealerId === dealerId).reduce((s, p) => s + p.amount, 0);
    return totalPurchases - totalPayments;
  }, [purchases, dealerPayments]);

  const getTotalOutstandingPayments = useCallback(() => {
    return dealers.reduce((total, d) => total + getDealerBalance(d.id), 0);
  }, [dealers, getDealerBalance]);

  const getLowStockProducts = useCallback(() => {
    return products.filter(p => getProductStock(p.id) <= p.minStock);
  }, [products, getProductStock]);

  return {
    products, dealers, purchases, sales, dealerPayments,
    addProduct, addDealer, addPurchase, addSale, addDealerPayment,
    getProductStock, getDealerBalance, getTotalOutstandingPayments, getLowStockProducts,
  };
}
