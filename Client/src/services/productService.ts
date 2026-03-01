import { supabase } from "../lib/supabase";

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

export const addProduct = async (product: {
  name: string;
  category?: string;
  cost_price: number;
  selling_price: number;
  min_stock: number;
  unit?: string;
}) => {
  const { error } = await supabase.from("products").insert([product]);

  return { error };
};
