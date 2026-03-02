import { apiRequest } from "./apiClient";

type SaleInput = {
  product_id: string;
  quantity: number;
  unit_price: number;
  customer_name?: string;
  date: string;
};

type SaleRecord = SaleInput & {
  id: string;
  total_amount: number;
  created_at: string;
};

export const getSales = async () => {
  return apiRequest<SaleRecord[]>("/api/sales");
};

export const addSale = async (sale: SaleInput) => {
  return apiRequest<SaleRecord>("/api/sales", {
    method: "POST",
    body: JSON.stringify(sale),
  });
};
