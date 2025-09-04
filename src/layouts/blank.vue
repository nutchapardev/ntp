<script>
import { useCustomizerStore } from "@/stores/customizer";

export default {
  name: "BlankLayout",
  data() {
    const customizer = useCustomizerStore();
    return {
      customizer,
    };
  },
};
</script>

<template>
  <v-locale-provider v-if="customizer.setRTLLayout" rtl>
    <v-app :theme="customizer.actTheme">
      <v-main>
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
