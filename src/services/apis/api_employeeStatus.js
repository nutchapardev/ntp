// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllEmployeeStatus = () => {
  return httpClient.get(server.EMPLOYEE_STATUS_URL);
};
