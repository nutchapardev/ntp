// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const createQuotation = (data) => {
  return httpClient.post(server.QUOTATION_URL, data);
};

export const getQuotation = () => {
  return httpClient.get(server.QUOTATION_URL);
};

export const getQuotationByID = (id) => {
  return httpClient.get(`${server.QUOTATION_URL}/${id}`);
};

export const updateQuotationByID = (id, data) => {
  return httpClient.put(`${server.QUOTATION_URL}/${id}`, data);
};
