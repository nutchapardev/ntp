// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getProvinces = () => {
  return httpClient.get(server.PROVINCE_URL)
}
