<script>
import LogoIcon from "@/assets/images/logos/white-logo-icon.svg";

export default {
  name: "LogoIcon",
  data() {
    return {
      LogoIcon: LogoIcon,
    };
  },
};
</script>

<template>
  <div class="logo">
    <RouterLink to="/">
      <img :src="LogoIcon" alt="home" />
    </RouterLink>
  </div>
</template>
