import { defineStore } from "pinia";
import serverService from "@/services/serverService";
import { server } from "@/services/constants";
import router from "@/router";
import Swal from "sweetalert2";
// import { c } from "node_modules/unplugin-vue-router/dist/types-CTGkmk9e";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    employeeData: null,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    getEmpData: (state) => state.employeeData,
    getLoading: (state) => state.isLoading,
  },
  actions: {
    async doLogin(values) {
      try {
        this.isLoading = true;
        const resultLogin = await serverService.login({
          Username: values.Username,
          Password: values.Password,
        });

        if (resultLogin.result) {
          const { employeeData, accessToken } = resultLogin;
          localStorage.setItem(server.TOKEN_KEY, accessToken);
          this.isAuthenticated = true;
          this.employeeData = employeeData;
          router.push("/dashboards/overview");
        } else {
          Swal.fire({
            title: "Error!",
            text: resultLogin.message,
            icon: "error",
          });
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Swal.fire({
          title: "Error!",
          text: JSON.stringify(error.message),
          icon: "error",
        });
      }
    },
    async doLogout() {
      serverService.logoff();
      this.isAuthenticated = false;
      this.employeeData = null;
      router.push("/login");
    },
    setLoadingOn() {
      this.isLoading = true;
    },
    setLoadingOff() {
      this.isLoading = false;
    },
    async restorelogin() {
      this.isLoading = true;
      const restoreResult = await serverService.isLoggedIn();
      // console.log(restoreResult)
      if (restoreResult.result) {
        const employeeData = restoreResult.employeeData;
        this.isAuthenticated = true;
        this.employeeData = employeeData;
        router.push("/dashboards/overview");
      } else {
        this.doLogout();
      }
      this.isLoading = false;
    },
  },
});
