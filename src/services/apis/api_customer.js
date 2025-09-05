// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getAllCustomers = () => {
  return httpClient.get(server.CUSTOMER_URL)
}

export const addCustomersAndAddresses = (data) => {
  return httpClient.post(server.CUSTOMER_URL, data)
}

export const deleteCustomerByID = (id) => {
  return httpClient.delete(`${server.CUSTOMER_URL}/${id}`)
}

export const editCustomerByID = (id, data) => {
  return httpClient.put(`${server.CUSTOMER_URL}/${id}`, data)
}
