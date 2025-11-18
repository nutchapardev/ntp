// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const createCashPledge = (data) => {
  return httpClient.post(server.CASH_PLEDGE_URL, data);
};

export const getCashPledgeByQuotationID = (id) => {
  return httpClient.get(`${server.CASH_PLEDGE_URL}/by-quotation-id/${id}`);
};

export const deleteCashPledgeByID = (id) => {
  return httpClient.delete(`${server.CASH_PLEDGE_URL}/${id}`);
};
