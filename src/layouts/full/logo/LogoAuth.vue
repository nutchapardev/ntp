<script>
import LogoLight from "./LogoLight.vue";
import LogoDark from "./LogoDark.vue";
import { useCustomizerStore } from "@/stores/customizer";

export default {
  name: "Logo",
  components: {
    LogoLight,
    LogoDark,
  },
  data() {
    const customizer = useCustomizerStore();
    return {
      customizer,
    };
  },
  computed: {
    dark() {
      // List of all dark themes
      const darkThemes = [
        "DARK_BLUE_THEME",
        "DARK_AQUA_THEME",
        "DARK_ORANGE_THEME",
        "DARK_PURPLE_THEME",
        "DARK_GREEN_THEME",
        "DARK_CYAN_THEME",
      ];
      // Check if the current theme is in the list
      return darkThemes.includes(this.customizer.actTheme);
    },
  },
};
</script>

<template>
  <LogoLight v-if="dark" />
  <LogoDark v-else />
</template>
