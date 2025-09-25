// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllVendors = () => {
  return httpClient.get(server.VENDOR_URL);
};

export const addVendor = (data) => {
  return httpClient.post(server.VENDOR_URL, data);
};

export const updateVendor = (id, data) => {
  return httpClient.put(`${server.VENDOR_URL}/${id}`, data);
};
