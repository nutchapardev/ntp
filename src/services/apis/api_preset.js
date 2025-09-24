// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllPresets = () => {
  return httpClient.get(server.PRESET_URL);
};

export const addPreset = (data) => {
  return httpClient.post(server.PRESET_URL, data);
};

export const deletePresetByID = (id) => {
  return httpClient.delete(`${server.PRESET_URL}/${id}`);
};
