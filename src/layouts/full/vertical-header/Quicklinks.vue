<script>
import { quickLink } from "@/_mockApis/headerData";

export default {
  name: "Quicklinks",
  data() {
    return {
      quickLink: quickLink,
    };
  },
};
</script>

<template>
  <div v-for="(item, i) in quickLink" :key="i" class="py-2">
    <RouterLink
      :to="item.href"
      class="text-decoration-none text-hover-primary font-weight-mediuum text-subtitle-1"
      >{{ item.title }}</RouterLink
    >
  </div>
</template>
