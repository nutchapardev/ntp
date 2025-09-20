<script>
import { useCustomizerStore } from "../../../stores/customizer"
import { useEcomStore } from "@/stores/apps/eCommerce"
import { Menu2Icon } from "vue-tabler-icons"
import LanguageDD from "./LanguageDD.vue"
import NotificationDD from "./NotificationDD.vue"
import ProfileDD from "./ProfileDD.vue"
import Searchbar from "./Searchbar.vue"
import Logo from "../logo/Logo.vue"
import RtlLogo from "../logo/RtlLogo.vue"
import LogoIcon from "../logo/LogoIcon.vue"
import ThemeToggler from "./ThemeToggler.vue"
import Navigations from "./Navigations.vue"
import Messages from "./Messages.vue"
import RightMobileSidebar from "./RightMobileSidebar.vue"

export default {
  name: "MainHeader",

  // 1. ลงทะเบียน components ทั้งหมดที่ import เข้ามา
  components: {
    LanguageDD,
    NotificationDD,
    ProfileDD,
    Searchbar,
    Logo,
    RtlLogo,
    LogoIcon,
    ThemeToggler,
    Navigations,
    Messages,
    RightMobileSidebar,
    Menu2Icon,
  },

  // 2. ย้าย state ที่เคยใช้ ref() มาไว้ใน data()
  data() {
    const customizer = useCustomizerStore()
    return {
      showSearch: false,
      // กำหนดค่าเริ่มต้นให้ priority โดยอ้างอิงจาก store
      priority: customizer.setHorizontalLayout ? 0 : 0,
    }
  },

  computed: {
    // 3. สร้าง computed property เพื่อเข้าถึง store ทำให้เรียกใช้ง่ายใน template
    customizer() {
      return useCustomizerStore()
    },
    ecomStore() {
      return useEcomStore()
    },
    // 4. ย้าย computed เดิมมาไว้ที่นี่
    getCart() {
      // เข้าถึง store ผ่าน this.ecomStore ที่เราสร้างไว้
      return this.ecomStore.cart
    },
  },

  methods: {
    // 5. ย้ายฟังก์ชันมาไว้ใน methods
    searchbox() {
      this.showSearch = !this.showSearch
    },
  },

  watch: {
    // 6. ย้าย watch มาไว้ใน watch option
    priority(newPriority) {
      this.priority = newPriority
    },
  },
}
</script>

<template>
  <v-app-bar
    elevation="5"
    :priority="priority"
    height="60"
    color="primary"
    class="main-head"
    style="position: fixed"
    id="top"
  >
    <div class="hidden-sm-and-down">
      <v-locale-provider v-if="customizer.setRTLLayout" rtl>
        <div class="pt-2 d-sm-flex d-none">
          <RtlLogo />
        </div>
        <div class="pt-2 pr-2 d-sm-none d-flex">
          <LogoIcon />
        </div>
      </v-locale-provider>
      <v-locale-provider v-else>
        <div class="pt-2 d-sm-flex d-none">
          <Logo />
        </div>
        <div class="pt-2 pr-2 d-sm-none d-flex">
          <LogoIcon />
        </div>
      </v-locale-provider>
    </div>

    <v-btn
      class="hidden-lg-and-down custom-hover-primary menu-toggle"
      size="small"
      icon
      color="primary"
      variant="text"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
    >
      <Icon icon="solar:list-bold" height="22" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up"
      icon
      variant="text"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
      size="small"
    >
      <Icon icon="solar:list-bold" height="22" />
    </v-btn>

    <Searchbar />

    <!-- <div class="hidden-sm-and-down">
      <Navigations />
    </div> -->

    <v-spacer class="hidden-sm-and-down" />

    <!-- <div class="hidden-sm-and-down">
      <LanguageDD />
    </div> -->

    <div class="hidden-md-and-up mt-2">
      <LogoIcon />
    </div>
    <div class="me-md-1">
      <ThemeToggler />
    </div>

    <!-- <div class="hidden-sm-and-down">
      <NotificationDD />
    </div> -->
    <!-- <div class="hidden-sm-and-down">
      <Messages />
    </div> -->

    <!-- <v-btn
      icon
      variant="text"
      color="primary"
      to="/ecommerce/checkout"
      size="small"
      class="ms-1 hidden-sm-and-down custom-hover-primary"
    >
      <v-badge color="error" :content="getCart?.length">
        <Icon icon="solar:cart-large-2-outline" height="22" />
      </v-badge>
    </v-btn> -->

    <div class="ms -2 hidden-sm-and-down">
      <ProfileDD />
    </div>

    <v-menu :close-on-content-click="true" class="mobile_popup">
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          class="hidden-md-and-up"
          color="primary"
          variant="text"
          v-bind="props"
          size="small"
        >
          <Icon icon="solar:menu-dots-bold-duotone" height="22" />
        </v-btn>
      </template>
      <v-sheet rounded="lg" elevation="10" class="mt-4 dropdown-box px-4 py-3">
        <div class="d-flex justify-space-between align-center">
          <!-- <RightMobileSidebar />
          <LanguageDD />
          <v-btn
            icon
            variant="text"
            class="mr-sm-3 mr-2 custom-hover-primary"
            to="/ecommerce/checkout"
            size="small"
          >
            <v-badge
              color="error"
              :content="getCart?.length"
              offset-x="-4"
              offset-y="-6"
            >
              <Icon icon="solar:cart-large-2-outline" height="22" />
            </v-badge>
          </v-btn>
          <NotificationDD />
          <Messages /> -->
          <ProfileDD />
        </div>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<style>
/*  */
</style>
