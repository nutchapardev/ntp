/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VueDraggableNext } from "vue-draggable-next";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VTimePicker } from "vuetify/components";
import { VTreeview } from "vuetify/components";

import { BLUE_THEME } from "@/theme/LightTheme";
import {
  DARK_BLUE_THEME,
  DARK_AQUA_THEME,
  DARK_ORANGE_THEME,
  DARK_PURPLE_THEME,
  DARK_GREEN_THEME,
  DARK_CYAN_THEME,
} from "@/theme/DarkTheme";

export default createVuetify({
  components: {
    ...components,
    draggable: VueDraggableNext,
    VTimePicker,
    VTreeview,
  },
  directives,

  theme: {
    defaultTheme: "BLUE_THEME",
    themes: {
      BLUE_THEME,
      DARK_BLUE_THEME,
      DARK_AQUA_THEME,
      DARK_ORANGE_THEME,
      DARK_PURPLE_THEME,
      DARK_GREEN_THEME,
      DARK_CYAN_THEME,
    },
  },
  defaults: {
    VCard: {
      rounded: "md",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VListItem: {
      minHeight: "45px",
    },
    VTooltip: {
      location: "top",
    },
  },
});
