import { apiRequest } from "./apiClient";

type PurchaseInput = {
  product_id: string;
  dealer_id: string;
  quantity: number;
  unit_price: number;
  date: string;
};

type PurchaseRecord = PurchaseInput & {
  id: string;
  total_amount: number;
  created_at: string;
};

export const getPurchases = async () => {
  return apiRequest<PurchaseRecord[]>("/api/purchases");
};

export const addPurchase = async (purchase: PurchaseInput) => {
  return apiRequest<PurchaseRecord>("/api/purchases", {
    method: "POST",
    body: JSON.stringify(purchase),
  });
};
