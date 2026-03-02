import { apiRequest } from "./apiClient";

type ProductInput = {
  name: string;
  category?: string;
  cost_price: number;
  selling_price: number;
  min_stock: number;
  unit?: string;
};

type ProductRecord = ProductInput & {
  id: string;
  created_at: string;
  current_stock: number;
};

type ServiceError = { message: string } | null;

export const getProducts = async (): Promise<{ data: ProductRecord[] | null; error: ServiceError }> => {
  return apiRequest<ProductRecord[]>("/api/products");
};

export const addProduct = async (product: ProductInput): Promise<{ data: ProductRecord | null; error: ServiceError }> => {
  return apiRequest<ProductRecord>("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
};
