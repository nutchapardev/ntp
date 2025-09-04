// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllCustomers = (data) => {
  return httpClient.get(server.CUSTOMER_URL, data);
};
