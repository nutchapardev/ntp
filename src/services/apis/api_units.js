// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient";
import { server } from "@/services/constants";

export const getUnits = () => {
  return httpClient.get(server.UNIT_URL);
};
