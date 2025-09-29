// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllImageCarTypes = () => {
  return httpClient.get(server.IMAGE_CAR_TYPE_URL);
};
