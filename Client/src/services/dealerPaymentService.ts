import { apiRequest } from "./apiClient";

type DealerPaymentInput = {
  dealer_id: string;
  amount: number;
  date: string;
  note?: string;
};

type DealerPaymentRecord = DealerPaymentInput & {
  id: string;
  created_at: string;
};

export const getDealerPayments = async () => {
  return apiRequest<DealerPaymentRecord[]>("/api/dealer-payments");
};

export const addDealerPayment = async (payment: DealerPaymentInput) => {
  return apiRequest<DealerPaymentRecord>("/api/dealer-payments", {
    method: "POST",
    body: JSON.stringify(payment),
  });
};
