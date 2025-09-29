// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllSubDistricts = () => {
  return httpClient.get(server.SUB_DISTRICT_URL);
};

export const getSubDistrictsByDistrictID = (districtId) => {
  return httpClient.get(`${server.SUB_DISTRICT_URL}/district/${districtId}`);
};
