//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

export const apiPath = "ntp-api";
// export const basePath = "http://49.231.43.77"
// export const basePath = "https://iamnutcha.com"
export const basePath = "http://localhost:8080";
export const apiUrl = basePath + "/" + apiPath;

export const server = {
  REGISTER_URL: `auth/register`,
  LOGIN_URL: `auth/login`,
  CHANGE_PASSWORD_URL: `auth/change-password`,
  TOKEN_KEY: `token`,
  RESTORE_LOGIN: `auth/restorelogin`,
  CUSTOMER_URL: `customers`,
  ADDRESS_URL: `addresses`,
  SUB_DISTRICT_URL: `subdistrict`,
  REPAIR_URL: `repair`,
  REPAIR_DETAIL_URL: `repairDetail`,
  BRAND_URL: `brands`,
  CAR_MODEL_URL: `carmodel`,
  CAR_URL: `cars`,
  PROVINCE_URL: `province`,
  DISTRICT_URL: `district`,
  CUSTOMER_TITLE_URL: `customertitle`,
  PART_URL: `parts`,
  PART_CATEGORY_URL: `partcategory`,
  REPAIR_CATEGORY_URL: `repaircategory`,
  PRESET_URL: `preset`,
  PRESET_DETAIL_URL: `presetdetails`,
  REF_MODEL_CATEGORY_PART_URL: `refModelCategoryParts`,
  EMPLOYEE_URL: `employee`,
  EMPLOYEE_STATUS_URL: `employeestatus`,
  POSITION_URL: `position`,
  ROLE_URL: `role`,
  VENDOR_URL: `vendors`,
  VENDOR_TYPE_URL: `vendortype`,
  IMAGE_CAR_TYPE_URL: `imagecartype`,
};

export const message = {
  kResultOk: "ok",
  kResultSuccess: "Success",
  kResultNok: "nok",
};
