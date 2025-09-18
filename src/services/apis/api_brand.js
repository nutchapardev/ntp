// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getBrands = () => {
  return httpClient.get(server.BRAND_URL);
};

export const getBrandByBrandID = (id) => {
  return httpClient.get(`${server.BRAND_URL}/${id}`);
};
