//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again."
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again."
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload."
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK"

export const apiPath = "ntp-api"
// export const basePath = "http://49.231.43.77"
export const basePath = "http://localhost:8080"
export const apiUrl = basePath + "/" + apiPath

export const server = {
  REGISTER_URL: `auth/register`,
  LOGIN_URL: `auth/login`,
  TOKEN_KEY: `token`,
  RESTORE_LOGIN: `auth/restorelogin`,
  CUSTOMER_URL: `customers`,
  ADDRESS_URL: `addresses`,
  SUB_DISTRICT_URL: `subdistrict`,
  REPAIR_URL: `repair`,
  BRAND_URL: `brands`,
  CAR_MODEL_URL: `carmodel`,
  CAR_URL: `cars`,
}

export const message = {
  kResultOk: "ok",
  kResultSuccess: "Success",
  kResultNok: "nok",
}
