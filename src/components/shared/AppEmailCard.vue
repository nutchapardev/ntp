<template>
  <div class="d-flex mainbox">
    <div class="compose pa-6" v-if="lgAndUp">
      <slot name="mailCompose"></slot>
    </div>

    <div class="mail-list">
      <v-divider class="d-lg-none d-block" />
      <slot name="mailList" :openEmailDetails="openEmailDetails"></slot>
    </div>

    <div class="mail-details pa-6 d-md-block d-none">
      <slot name="mailDetail"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmailLayout",

  data() {
    return {
      // 1. ย้าย state ทั้งหมดจาก ref() มาไว้ใน data()
      sDrawer: false,
      eDrawer: false,
      selectedEmail: null,
    }
  },

  computed: {
    // 2. เข้าถึง useDisplay() ผ่าน this.$vuetify.display ใน computed
    lgAndUp() {
      return this.$vuetify.display.lgAndUp
    },
    xs() {
      return this.$vuetify.display.xs
    },
  },

  methods: {
    // 3. ย้ายฟังก์ชันมาไว้ใน methods
    openEmailDetails(email) {
      this.selectedEmail = email
      this.eDrawer = true
    },
  },
}
</script>

<style lang="scss">
.compose {
  max-width: 235px;
  width: 100%;
}
.mail-list {
  max-width: 340px;
  width: 100%;
}
.mail-details {
  width: 100%;
}

@media screen and (max-width: 991px) {
  .mail-list {
    max-width: 100%;
  }
}
@media screen and (min-width: 991px) {
  .compose,
  .mail-list {
    border-inline-end-width: thin !important;
    border-inline-end-style: solid !important;
    border-inline-end-color: rgba(
      var(--v-border-color),
      var(--v-border-opacity)
    ) !important;
  }
}
</style>
