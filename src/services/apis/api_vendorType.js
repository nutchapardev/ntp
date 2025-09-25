// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllVendorType = () => {
  return httpClient.get(server.VENDOR_TYPE_URL);
};
