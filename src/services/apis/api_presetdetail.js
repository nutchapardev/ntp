// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const bulkCreatePresetDetail = (data) => {
  return httpClient.post(`${server.PRESET_DETAIL_URL}/bulk`, data);
};

export const updatePresetDetailByID = (id, data) => {
  return httpClient.put(`${server.PRESET_DETAIL_URL}/${id}`, data);
};

export const deletePresetDetailByID = (id) => {
  return httpClient.delete(`${server.PRESET_DETAIL_URL}/${id}`);
};
