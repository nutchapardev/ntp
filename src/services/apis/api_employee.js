// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllEmployees = () => {
  return httpClient.get(server.EMPLOYEE_URL);
};

export const updateEmployee = (id, data) => {
  return httpClient.put(`${server.EMPLOYEE_URL}/${id}`, data);
};
