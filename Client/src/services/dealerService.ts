import { apiRequest } from "./apiClient";

type DealerInput = {
  name: string;
  phone?: string;
  address?: string;
};

type DealerRecord = DealerInput & {
  id: string;
  created_at: string;
};

export const getDealers = async () => {
  return apiRequest<DealerRecord[]>("/api/dealers");
};

export const addDealer = async (dealer: DealerInput) => {
  return apiRequest<DealerRecord>("/api/dealers", {
    method: "POST",
    body: JSON.stringify(dealer),
  });
};
