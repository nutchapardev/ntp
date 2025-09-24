// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const addCar = (data) => {
  return httpClient.post(server.CAR_URL, data);
};

export const getCars = () => {
  return httpClient.get(server.CAR_URL);
};

export const getCarByCarID = (id) => {
  return httpClient.get(`${server.CAR_URL}/${id}`);
};

export const createCarWithCustomer = (data) => {
  return httpClient.post(`${server.CAR_URL}/with-customer`, data);
};
