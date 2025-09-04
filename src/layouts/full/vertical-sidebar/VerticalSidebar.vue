<script>
import { useCustomizerStore } from "@/stores/customizer";
import sidebarItems from "./sidebarItem";

import NavGroup from "./NavGroup/index.vue";
import NavItem from "./NavItem/index.vue";
import NavCollapse from "./NavCollapse/NavCollapse.vue";
import Logo from "../logo/Logo.vue";
import { useAuthStore } from "@/stores/auth";
import { PowerIcon } from "vue-tabler-icons";
import SidebarProfile from "../vertical-header/SidebarProfile.vue";

export default {
  name: "VerticalSidebar",
  components: {
    NavGroup,
    NavItem,
    NavCollapse,
    Logo,
    PowerIcon,
    SidebarProfile,
  },
  data() {
    const customizer = useCustomizerStore();
    const authStore = useAuthStore();
    return {
      customizer,
      authStore,
      sidebarMenu: sidebarItems,
    };
  },
};
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
    width="256"
    style="position: fixed"
  >
    <perfect-scrollbar class="scrollnavbar">
      <div class="profile">
        <div class="profile-img py-10 px-3">
          <v-avatar size="50">
            <img
              src="@/assets/images/profile/user-1.jpg"
              width="50"
              alt="Julia"
            />
          </v-avatar>
        </div>
        <div class="profile-name d-flex align-center px-3">
          <div class="profile-logout w-100">
            <SidebarProfile />
          </div>
        </div>
      </div>
      <v-list class="py-3 px-4">
        <template v-for="item in sidebarMenu">
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <NavCollapse
            class="leftPadding"
            :item="item"
            :level="0"
            v-else-if="item.children"
            :key="item.header || item.id"
          />
          <NavItem :item="item" v-else class="leftPadding" :key="item.id" />
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
