// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getCustomerTitle = () => {
  return httpClient.get(server.CUSTOMER_TITLE_URL)
}
