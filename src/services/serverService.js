import router from "@/router";
import httpClient from "./httpClient";
import { server, message } from "@/services/constants";
import * as authApis from "@/services/apis/api_auth";
import * as customerApis from "@/services/apis/api_customer";
import * as addressApis from "@/services/apis/api_address";
import * as subDistrictApis from "@/services/apis/api_subdistrict";
import * as repairApis from "@/services/apis/api_repair";
import * as brandApis from "@/services/apis/api_brand";
import * as carModelApis from "@/services/apis/api_carModel";
import * as carApis from "@/services/apis/api_car";
import * as provinceApis from "@/services/apis/api_province";
import * as customerTitleApis from "@/services/apis/api_customerTitle";
import * as refModelCategoryPartsApis from "@/services/apis/api_refModelCategoryParts";
import * as repairDetailApis from "@/services/apis/api_repairDetail";
import * as partApis from "@/services/apis/api_part";
import * as partCategoryApis from "@/services/apis/api_partcategory";
import * as repairCategoryApis from "@/services/apis/api_repaircategory";
import * as presetApis from "@/services/apis/api_preset";
import * as presetDetailApis from "@/services/apis/api_presetdetail";
import * as employeeApis from "@/services/apis/api_employee";
import * as positionApis from "@/services/apis/api_position";
import * as roleApis from "@/services/apis/api_role";
import * as employeeStatusApis from "@/services/apis/api_employeeStatus";
import * as vendorApis from "@/services/apis/api_vendor";
import * as vendorTypeApis from "@/services/apis/api_vendorType";
import * as districtApis from "@/services/apis/api_districts";
import * as imageCarApis from "@/services/apis/api_imageCar";
import * as imageCarTypeApis from "@/services/apis/api_imageCarType";
import * as repairPartApis from "@/services/apis/api_repairpart";
import * as unitApis from "@/services/apis/api_units";
import * as companyDataApis from "@/services/apis/api_companyData";
import * as invoiceApis from "@/services/apis/api_invoices";
import * as quotationApis from "@/services/apis/api_quotation";
import * as quotationDetailApis from "@/services/apis/api_quotationDetail";
import * as quotationPartApis from "@/services/apis/api_quotationParts";
import * as cashPledgeApis from "@/services/apis/api_cashPledge";

const login = async (values) => {
  const resultLogin = await httpClient.post(server.LOGIN_URL, values);
  return resultLogin.data;
};

const isLoggedIn = async () => {
  const resultRestoreLogin = await httpClient.get(server.RESTORE_LOGIN);
  return resultRestoreLogin.data;
};

const logoff = async () => {
  localStorage.removeItem(server.TOKEN_KEY);
  return true;
};

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
  ...employeeApis,
  ...positionApis,
  ...roleApis,
  ...employeeStatusApis,
  ...vendorApis,
  ...vendorTypeApis,
  ...districtApis,
  ...imageCarApis,
  ...imageCarTypeApis,
  ...repairPartApis,
  ...unitApis,
  ...companyDataApis,
  ...invoiceApis,
  ...quotationApis,
  ...quotationDetailApis,
  ...quotationPartApis,
  ...cashPledgeApis,
};
