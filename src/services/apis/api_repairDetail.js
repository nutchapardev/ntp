// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const addRepairDetailWithPart = (data) => {
  return httpClient.post(`${server.REPAIR_DETAIL_URL}/with-part`, data);
};

export const getRepairDetailByRepairID = (id) => {
  return httpClient.get(`${server.REPAIR_DETAIL_URL}/by-repair-id/${id}`);
};
