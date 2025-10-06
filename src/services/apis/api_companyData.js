// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getCompanyData = () => {
  return httpClient.get(server.COMPANY_DATA_URL)
}
