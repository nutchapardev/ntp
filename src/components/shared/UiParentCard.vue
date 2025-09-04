<script>
export default {
  name: "UiParentCard",
  props: {
    title: String,
  },
};
</script>

// ===============================|| Ui Parent
Card||=============================== //
<template>
  <v-card elevation="10">
    <v-card-item class="py-4 px-6">
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title class="text-h5">{{ title }}</v-card-title>
        <slot name="action"></slot>
      </div>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
