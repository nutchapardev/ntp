// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const register = (data) => {
  return httpClient.post(server.REGISTER_URL, data)
}

export const changePassword = (data) => {
  return httpClient.post(server.CHANGE_PASSWORD_URL, data)
}

// export const login = (data) => {
//   return httpClient.post(server.LOGIN_URL, data);
// };

// export const updateEmail = (id, data) => {
//   return httpClient.put(server.EMAIL_URL + "/" + id, data);
// };

// export const deleteEmail = (id) => {
//   return httpClient.delete(server.EMAIL_URL + `/${id}`);
// };
