// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getAllRepairs = () => {
  return httpClient.get(server.REPAIR_URL)
}

export const getRepairByID = (id) => {
  return httpClient.get(`${server.REPAIR_URL}/${id}`)
}

export const addRepair = (data) => {
  return httpClient.post(server.REPAIR_URL, data)
}
