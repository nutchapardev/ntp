// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getPartCategory = () => {
  return httpClient.get(server.PART_CATEGORY_URL);
};
