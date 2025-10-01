// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const addRepairPart = (data) => {
  return httpClient.post(server.REPAIR_PART_URL, data);
};

export const deleteRepairPartByID = (id) => {
  return httpClient.delete(`${server.REPAIR_PART_URL}/${id}`);
};

export const bulkUpdateRepairPart = (data) => {
  return httpClient.put(`${server.REPAIR_PART_URL}/bulk/update`, data);
};
