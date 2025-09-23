// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const updatePresetDetailByID = (id, data) => {
  return httpClient.put(`${server.PRESET_DETAIL_URL}/${id}`, data)
}
