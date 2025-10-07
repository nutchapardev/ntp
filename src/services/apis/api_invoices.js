// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getInvoices = () => {
  return httpClient.get(server.INVOICE_URL);
};

export const getInvoiceByID = (id) => {
  return httpClient.get(`${server.INVOICE_URL}/${id}`);
};

export const createInvoice = (data) => {
  return httpClient.post(server.INVOICE_URL, data);
};

export const updateInvoice = (id, data) => {
  return httpClient.put(`${server.INVOICE_URL}/${id}`, data);
};

export const deleteInvoice = (id) => {
  return httpClient.delete(`${server.INVOICE_URL}/${id}`);
};
