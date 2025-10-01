<script>
import { useCustomizerStore } from "@/stores/customizer";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "BlankLayout",
  data() {
    const customizer = useCustomizerStore();
    const authStore = useAuthStore();
    return {
      customizer,
      authStore,
    };
  },
};
</script>

<template>
  <v-locale-provider v-if="customizer.setRTLLayout" rtl>
    <v-app :theme="customizer.actTheme">
      <v-main>
        <Loading :loading="authStore.getLoading" />
        <RouterView />
      </v-main>
    </v-app>
  </v-locale-provider>

  <v-locale-provider v-else>
    <v-app :theme="customizer.actTheme">
      <v-main>
        <RouterView />
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
