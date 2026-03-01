export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  minStock: number;
  unit: string;
  createdAt: string;
}

export interface Dealer {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  productId: string;
  dealerId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerName: string;
  date: string;
  createdAt: string;
}

export interface DealerPayment {
  id: string;
  dealerId: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}
