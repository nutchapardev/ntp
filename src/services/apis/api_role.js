// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllRoles = () => {
  return httpClient.get(server.ROLE_URL);
};
