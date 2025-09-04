<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
export default {
  name: "App",
  data() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  async created() {
    await this.authStore.restorelogin();
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Itim&family=K2D:wght@300&display=swap");
body,
html div {
  font-family: "Itim", cursive;
  font-family: "K2D", sans-serif;
  /* background-color: red; */
}
</style>
