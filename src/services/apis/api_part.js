// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllParts = () => {
  return httpClient.get(server.PART_URL);
};

export const createPart = (data) => {
  return httpClient.post(server.PART_URL, data);
};

export const updatePart = (id, data) => {
  return httpClient.put(`${server.PART_URL}/${id}`, data);
};
