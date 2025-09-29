// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getDistrictByProvinceID = (provinceId) => {
  return httpClient.get(`${server.DISTRICT_URL}/province/${provinceId}`);
};
