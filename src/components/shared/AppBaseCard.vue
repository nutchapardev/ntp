<template>
  <div class="d-flex mainbox">
    <div class="left-part" v-if="lgAndUp">
      <slot name="leftpart"></slot>
    </div>

    <div class="right-part">
      <v-btn
        block
        @click="sDrawer = !sDrawer"
        variant="text"
        class="d-lg-none d-md-flex d-sm-flex"
      >
        <Menu2Icon size="20" class="mr-2" /> Menu
      </v-btn>
      <v-divider class="d-lg-none d-block" />
      <slot name="rightpart"></slot>
    </div>
  </div>

  <v-navigation-drawer
    temporary
    v-model="sDrawer"
    width="320"
    top
    v-if="!lgAndUp"
  >
    <v-card-text class="pa-0">
      <slot name="mobileLeftContent"></slot>
    </v-card-text>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "ResponsiveLayout",

  data() {
    return {
      // 1. ย้าย state จาก ref() มาไว้ใน data()
      sDrawer: false,
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
}
</script>

<style lang="scss">
.mainbox {
  position: relative;
  overflow: hidden;
}
.left-part {
  width: 320px;
  border-right: 1px solid rgb(var(--v-theme-borderColor));
  min-height: 500px;
  transition: 0.1s ease-in;
  flex-shrink: 0;
}
.v-theme--light {
  .left-part {
    background: white;
  }
}
.v-theme--dark {
  .left-part {
    background: #2b2b2b;
  }
}
.right-part {
  width: 100%;
  min-height: 500px;
  position: relative;
}
</style>
