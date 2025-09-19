// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getCarModelByBrandID = (id) => {
  return httpClient.get(`${server.CAR_MODEL_URL}/brand/${id}`);
};

export const addCarModel = (data) => {
  return httpClient.post(server.CAR_MODEL_URL, data);
};
