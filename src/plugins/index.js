/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "@/stores";
import router from "@/router";
import { Icon } from "@iconify/vue";
import VueScrollTo from "vue-scrollto";
import { PerfectScrollbarPlugin } from "vue3-perfect-scrollbar";
import VueApexCharts from "vue3-apexcharts";
import VueTablerIcons from "vue-tabler-icons";
// 1. เปลี่ยนวิธี import Maska
// import * as maska from "maska";
import Maska from "maska";
import messages from "@/utils/locales/messages";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  locale: "en",
  messages: messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(PerfectScrollbarPlugin)
    // .use(PerfectScrollbar)
    // .component("PerfectScrollbar", PerfectScrollbarPlugin)
    // .use(PerfectScrollbarPlugin, {
    //   componentName: "perfect-scrollbar",
    // })
    .use(VueApexCharts)
    .use(VueTablerIcons)
    .use(Maska)
    // 2. เปลี่ยนมาใช้ .directive() แทน .use()
    // .directive("maska", maska)
    .component("Icon", Icon)
    .use(VueScrollTo, {
      duration: 1000,
      easing: "ease",
    });
}
