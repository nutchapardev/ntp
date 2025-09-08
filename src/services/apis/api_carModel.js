// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getCarModelByBrandID = (id) => {
  return httpClient.get(`${server.CAR_MODEL_URL}/brand/${id}`)
}
