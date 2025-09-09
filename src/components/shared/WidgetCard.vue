<template>
  <v-card variant="outlined" elevation="0" class="mb-6 overflow-hidden">
    <v-card-item>
      <v-card-title class="text-18">{{ title }}</v-card-title>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ParentCard",
  props: {
    // 1. ย้ายการประกาศ props มาไว้ใน `props` option
    title: {
      type: String,
    },
  },
}
</script>
