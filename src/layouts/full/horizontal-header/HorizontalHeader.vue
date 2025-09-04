<script>
import { useCustomizerStore } from "@/stores/customizer";
import { useEcomStore } from "@/stores/apps/eCommerce";
// Icon Imports
import {
  GridDotsIcon,
  LanguageIcon,
  SearchIcon,
  Menu2Icon,
  BellRingingIcon,
  ShoppingCartIcon,
} from "vue-tabler-icons";
import Logo from "../logo/Logo.vue";
import LogoIcon from "../logo/LogoIcon.vue";
import RtlLogo from "../logo/RtlLogo.vue";
// dropdown imports
import LanguageDD from "../vertical-header/LanguageDD.vue";
import NotificationDD from "../vertical-header/NotificationDD.vue";
import ProfileDD from "../vertical-header/ProfileDD.vue";
import Searchbar from "../vertical-header/Searchbar.vue";
import ThemeToggler from "../vertical-header/ThemeToggler.vue";
import Navigations from "../vertical-header/Navigations.vue";
import Messages from "../vertical-header/Messages.vue";
import RightMobileSidebar from "../vertical-header/RightMobileSidebar.vue";

export default {
  name: "HorizontalHeader",
  components: {
    GridDotsIcon,
    LanguageIcon,
    SearchIcon,
    Menu2Icon,
    BellRingingIcon,
    ShoppingCartIcon,
    Logo,
    LogoIcon,
    RtlLogo,
    LanguageDD,
    NotificationDD,
    ProfileDD,
    Searchbar,
    ThemeToggler,
    Navigations,
    Messages,
    RightMobileSidebar,
  },
  data() {
    const customizer = useCustomizerStore();
    const store = useEcomStore();
    return {
      customizer,
      store,
      showSearch: false,
      drawer: false,
      appsdrawer: false,
      priority: customizer.setHorizontalLayout ? 0 : 0,
    };
  },
  computed: {
    getCart() {
      return this.store.cart;
    },
  },
  methods: {
    searchbox() {
      this.showSearch = !this.showSearch;
    },
  },
  watch: {
    priority(newPriority) {
      this.priority = newPriority;
    },
  },
};
</script>

<template>
  <v-app-bar
    elevation="10"
    :priority="priority"
    height="64"
    class="horizontal-header main-head"
    color="primary"
    app
  >
    <div
      :class="
        customizer.boxed
          ? 'maxWidth v-toolbar__content px-lg-0 px-4'
          : 'v-toolbar__content px-6'
      "
    >
      <div class="hidden-sm-and-down">
        <v-locale-provider v-if="customizer.setRTLLayout" rtl>
          <div class="pt-2 pr-4 d-sm-flex d-none">
            <RtlLogo />
          </div>
          <div class="pt-2 pr-2 d-sm-none d-flex">
            <LogoIcon />
          </div>
        </v-locale-provider>
        <v-locale-provider v-else>
          <div class="pt-2 pr-4 d-sm-flex d-none">
            <Logo />
          </div>
          <div class="pt-2 pr-2 d-sm-none d-flex">
            <LogoIcon />
          </div>
        </v-locale-provider>
      </div>

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

      <div class="hidden-sm-and-down">
        <Navigations />
      </div>

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
        <v-sheet
          rounded="lg"
          elevation="10"
          class="mt-4 dropdown-box px-4 py-3"
        >
          <div class="d-flex justify-space-between align-center">
            <RightMobileSidebar />
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
            <Messages />
            <ProfileDD />
          </div>
        </v-sheet>
      </v-menu>
    </div>
  </v-app-bar>
</template>
