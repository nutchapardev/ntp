// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const createSingleQuotationDetails = (data) => {
  return httpClient.post(server.QUOTATION_DETAIL_URL, data);
};

export const createQuotationDetailsWithParts = (data) => {
  return httpClient.post(
    `${server.QUOTATION_DETAIL_URL}/create-with-parts`,
    data
  );
};

export const getQuotationDetailByQuotationID = (id) => {
  return httpClient.get(`${server.QUOTATION_DETAIL_URL}/by-quotation-id/${id}`);
};

export const deleteQuotationDetailsWithParts = async (id, data) => {
  return httpClient.delete(`${server.QUOTATION_DETAIL_URL}/delete-with-parts/${id}`, data);
};
