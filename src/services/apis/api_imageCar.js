// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getCarImagesByRepairID = (id) => {
  return httpClient.get(`${server.IMAGE_CAR_URL}/repairID/${id}`);
};

export const deleteCarImagesByID = (id) => {
  return httpClient.delete(`${server.IMAGE_CAR_URL}/${id}`);
};
