<script>
import RtlLogo from "@/assets/images/logos/Rtllogo.svg";

export default {
  name: "RtlLogo",
  data() {
    return {
      RtlLogo: RtlLogo,
    };
  },
};
</script>

<template>
  <div class="logo">
    <RouterLink to="/">
      <img :src="RtlLogo" alt="home" />
    </RouterLink>
  </div>
</template>
