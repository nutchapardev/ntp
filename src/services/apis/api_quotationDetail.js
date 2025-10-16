// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const createQuotationDetailsWithParts = (data) => {
  return httpClient.post(server.QUOTATION_DETAIL_URL, data);
};

export const getQuotationDetailByQuotationID = (id) => {
  return httpClient.get(`${server.QUOTATION_DETAIL_URL}/by-quotation-id/${id}`);
};
