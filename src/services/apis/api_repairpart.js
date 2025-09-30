// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const addRepairPart = (data) => {
  return httpClient.post(server.REPAIR_PART_URL, data);
};
