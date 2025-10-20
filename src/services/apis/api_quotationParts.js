// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const createQuotationPart = (data) => {
  return httpClient.post(server.QUOTATION_PART_URL, data);
};

export const deleteQuotationPartByID = (id) => {
  return httpClient.delete(`${server.QUOTATION_PART_URL}/${id}`);
};
