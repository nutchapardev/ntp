// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getRepairCategoryByModelAndPartCategory = (
  ModelID,
  PartCategoryID
) => {
  return httpClient.get(
    `${server.REPAIR_CATEGORY_URL}/by-model-part-category/${ModelID}/${PartCategoryID}`
  );
};

export const addRepairCategoryWithRefs = (data) => {
  return httpClient.post(`${server.REPAIR_CATEGORY_URL}/create-with-ref`, data);
};
