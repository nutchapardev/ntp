// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getAllRepairs = () => {
  return httpClient.get(server.REPAIR_URL)
}
