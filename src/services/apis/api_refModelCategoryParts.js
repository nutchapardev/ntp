// import { imageUrl } from "./constants";
import httpClient from "@/services/httpClient"
import { server } from "@/services/constants"

export const getRefModelCategoryPartByModelID = (id) => {
  return httpClient.get(`${server.REF_MODEL_CATEGORY_PART_URL}/by-model/${id}`)
}
