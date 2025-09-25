// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getAllPositions = () => {
  return httpClient.get(server.POSITION_URL);
};
