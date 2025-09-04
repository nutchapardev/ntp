/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import { fakeBackend } from "@/utils/helpers/fake-backend";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";
import "@/scss/style.scss";
import "vue3-carousel/dist/carousel.css";
import "vue3-perfect-scrollbar/style.css";

const app = createApp(App);
fakeBackend(); // Initialize fake backend if needed
registerPlugins(app);

app.mount("#app");
