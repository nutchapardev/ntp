// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getQuotation = () => {
  return httpClient.get(server.QUOTATION_URL);
};
