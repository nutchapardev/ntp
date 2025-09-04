import { defineStore } from "pinia";
import router from "@/router";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    // user: JSON.parse(localStorage.getItem("user")),
    user: null,
    returnUrl: "/",
  }),
  actions: {
    async login(username, password) {
      const user = await fetchWrapper.post(`${baseUrl}/authenticate`, {
        username,
        password,
      });

      // update pinia state
      this.user = user;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem("user", JSON.stringify(user));

      // redirect to previous url or default to home page
      // router.push(this.returnUrl || "/dashboards/general");
      router.push(this.returnUrl);
    },
    logout() {
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      // router.push("/authentication/login");
    },
  },
});
