<script>
import Darklogo from "@/assets/images/logos/logolight.svg";

export default {
  name: "LogoDark",
  data() {
    return {
      Darklogo: Darklogo,
    };
  },
};
</script>

<template>
  <div class="logo">
    <RouterLink to="/">
      <img :src="Darklogo" alt="home" />
    </RouterLink>
  </div>
</template>
