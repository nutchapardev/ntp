<script>
import { RouterView } from "vue-router";
import VerticalSidebarVue from "./full/vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "./full/vertical-header/VerticalHeader.vue";
import HorizontalHeader from "./full/horizontal-header/HorizontalHeader.vue";
import HorizontalSidebar from "./full/horizontal-sidebar/HorizontalSidebar.vue";
import Customizer from "./full/customizer/Customizer.vue";
import { useCustomizerStore } from "@/stores/customizer";
import { SettingsIcon } from "vue-tabler-icons";

export default {
  name: "DefaultLayout",
  components: {
    RouterView,
    VerticalSidebarVue,
    VerticalHeaderVue,
    HorizontalHeader,
    HorizontalSidebar,
    Customizer,
    SettingsIcon,
  },
  setup() {
    const customizer = useCustomizerStore();
    return {
      customizer,
    };
  },
};
</script>

<template>
  <v-app
    :theme="customizer.actTheme"
    :class="[
      customizer.actTheme,
      customizer.mini_sidebar ? 'mini-sidebar' : '',
      customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
      customizer.setBorderCard ? 'cardBordered' : '',
      customizer.inputBg ? 'inputWithbg' : '',
    ]"
  >
    <v-locale-provider :rtl="customizer.setRTLLayout">
      <!-- <v-navigation-drawer
        app
        temporary
        elevation="10"
        :location="customizer.setRTLLayout ? 'left' : 'right'"
        v-model="customizer.Customizer_drawer"
        width="320"
        :class="customizer.setRTLLayout ? 'left-customizer' : ''"
      >
        <Customizer />
      </v-navigation-drawer> -->

      <VerticalHeaderVue v-if="!customizer.setHorizontalLayout" />
      <VerticalSidebarVue v-if="!customizer.setHorizontalLayout" />
      <HorizontalHeader v-if="customizer.setHorizontalLayout" />
      <HorizontalSidebar v-if="customizer.setHorizontalLayout" />

      <v-main>
        <v-container fluid class="page-wrapper pb-sm-15 pb-10">
          <div :class="customizer.boxed ? 'maxWidth' : ''">
            <RouterView v-slot="{ Component, route }">
              <transition name="fade" mode="out-in">
                <div :key="route.name">
                  <component :is="Component" />
                </div>
              </transition>
            </RouterView>

            <!-- <v-btn
              class="customizer-btn"
              size="large"
              icon
              variant="flat"
              color="primary"
              @click.stop="
                customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)
              "
            >
              <SettingsIcon />
            </v-btn> -->
          </div>
        </v-container>
      </v-main>
    </v-locale-provider>
  </v-app>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
