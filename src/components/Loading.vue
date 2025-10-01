<template>
  <v-overlay
    :model-value="loading"
    class="d-flex align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    // รับค่า prop ชื่อ 'loading' เพื่อเปิด/ปิดการแสดงผล
    // กำหนดให้เป็น Boolean และจำเป็นต้องส่งค่ามา
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
