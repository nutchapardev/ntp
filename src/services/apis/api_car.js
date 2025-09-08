// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getCars = () => {
  return httpClient.get(server.CAR_URL)
}

export const getCarByCarID = (id) => {
  return httpClient.get(`${server.CAR_URL}/${id}`)
}
