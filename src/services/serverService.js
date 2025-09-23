import router from "@/router"
import httpClient from "./httpClient"
import { server, message } from "@/services/constants"
import * as authApis from "@/services/apis/api_auth"
import * as customerApis from "@/services/apis/api_customer"
import * as addressApis from "@/services/apis/api_address"
import * as subDistrictApis from "@/services/apis/api_subdistrict"
import * as repairApis from "@/services/apis/api_repair"
import * as brandApis from "@/services/apis/api_brand"
import * as carModelApis from "@/services/apis/api_carModel"
import * as carApis from "@/services/apis/api_car"
import * as provinceApis from "@/services/apis/api_province"
import * as customerTitleApis from "@/services/apis/api_customerTitle"
import * as refModelCategoryPartsApis from "@/services/apis/api_refModelCategoryParts"
import * as repairDetailApis from "@/services/apis/api_repairDetail"
import * as partApis from "@/services/apis/api_part"
import * as partCategoryApis from "@/services/apis/api_partcategory"
import * as repairCategoryApis from "@/services/apis/api_repaircategory"
import * as presetApis from "@/services/apis/api_preset"
import * as presetDetailApis from "@/services/apis/api_presetdetail"

const login = async (values) => {
  const resultLogin = await httpClient.post(server.LOGIN_URL, values)
  return resultLogin.data
}

const isLoggedIn = async () => {
  const resultRestoreLogin = await httpClient.get(server.RESTORE_LOGIN)
  return resultRestoreLogin.data
}

const logoff = async () => {
  localStorage.removeItem(server.TOKEN_KEY)
  return true
}

export default {
  login,
  logoff,
  isLoggedIn,
  ...authApis,
  ...customerApis,
  ...addressApis,
  ...subDistrictApis,
  ...repairApis,
  ...brandApis,
  ...carModelApis,
  ...carApis,
  ...provinceApis,
  ...customerTitleApis,
  ...refModelCategoryPartsApis,
  ...repairDetailApis,
  ...partApis,
  ...partCategoryApis,
  ...repairCategoryApis,
  ...presetApis,
  ...presetDetailApis,
}
