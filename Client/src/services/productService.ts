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

const STORAGE_KEY = "bninventory.products";

const readProducts = (): ProductRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProductRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeProducts = (products: ProductRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = async (): Promise<{ data: ProductRecord[]; error: ServiceError }> => {
  try {
    const products = readProducts().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return { data: products, error: null };
  } catch {
    return { data: [], error: { message: "Failed to load products" } };
  }
};

export const addProduct = async (product: ProductInput): Promise<{ error: ServiceError }> => {
  try {
    const products = readProducts();
    const nextProduct: ProductRecord = {
      ...product,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      current_stock: 0,
    };
    writeProducts([nextProduct, ...products]);
    return { error: null };
  } catch {
    return { error: { message: "Failed to save product" } };
  }
};
