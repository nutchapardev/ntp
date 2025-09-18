// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllParts = () => {
  return httpClient.get(server.PART_URL);
};
