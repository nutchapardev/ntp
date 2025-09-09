<template>
  <v-card variant="outlined" elevation="0">
    <v-card-item>
      <v-card-title class="text-18">{{ title }}</v-card-title>
    </v-card-item>
    <v-divider></v-divider>

    <slot />
  </v-card>
</template>

<script>
export default {
  name: "TableCard",
  props: {
    // 1. ย้ายการประกาศ props มาไว้ใน `props` option
    title: {
      type: String,
    },
  },
}
</script>
