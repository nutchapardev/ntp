// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const addAddress = (data) => {
  return httpClient.post(server.ADDRESS_URL, data)
}

export const deleteAddressByAddressID = (id) => {
  return httpClient.delete(`${server.ADDRESS_URL}/${id}`)
}
