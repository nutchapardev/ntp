import router from "@/router";
import httpClient from "./httpClient";
import { server, message } from "@/services/constants";
import * as authApis from "@/services/apis/api_auth";
import * as customerApis from "@/services/apis/api_customer";

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
};
