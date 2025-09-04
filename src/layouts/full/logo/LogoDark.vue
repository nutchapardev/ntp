<script>
import logo from "@/assets/images/logos/logo.svg";

export default {
  name: "Logo",
  data() {
    return {
      logo: logo,
    };
  },
};
</script>

<template>
  <div class="logo">
    <RouterLink to="/">
      <img :src="logo" alt="home" />
    </RouterLink>
  </div>
</template>
