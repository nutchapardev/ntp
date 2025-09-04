<template>
  <LogoLight />
</template>

<script>
import LogoLight from "./LogoLight.vue";
import { useCustomizerStore } from "@/stores/customizer";

export default {
  name: "Logo",
  components: {
    LogoLight,
  },
  setup() {
    const customizer = useCustomizerStore();
    return {
      customizer,
    };
  },
};
</script>
