<template>
  <VCard class="overflow-hidden" elevation="10">
    <v-toolbar color="transparent">
      <v-card-title class="text-h5">{{ heading }}</v-card-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-divider></v-divider>
    <div class="pa-5">
      <slot />
    </div>
  </VCard>
</template>

<script>
export default {
  name: "BaseCard",
  props: {
    // 1. ย้ายการประกาศ props มาไว้ใน `props` option
    heading: {
      type: String,
    },
  },
}
</script>
