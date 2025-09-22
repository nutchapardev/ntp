// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getRefModelCategoryPartByModelID = (id) => {
  return httpClient.get(`${server.REF_MODEL_CATEGORY_PART_URL}/by-model/${id}`);
};

export const createMultipleRefModelCategoryPartByModelID = (data) => {
  return httpClient.post(`${server.REF_MODEL_CATEGORY_PART_URL}/bulk`, data);
};

export const deleteRefModelCategoryPartByID = (id) => {
  return httpClient.delete(`${server.REF_MODEL_CATEGORY_PART_URL}/${id}`);
};
