<script>
import { useCustomizerStore } from "@/stores/customizer"
import HorizontalItems from "./horizontalItems"
import NavItem from "./NavItem/Index.vue"
import NavCollapse from "./NavCollapse/Index.vue"
import VerticalSidebar from "../vertical-sidebar/VerticalSidebar.vue"

export default {
  name: "HorizontalSidebar",
  components: {
    NavItem,
    NavCollapse,
    VerticalSidebar,
  },
  data() {
    const customizer = useCustomizerStore()
    return {
      customizer,
      sidebarMenu: HorizontalItems,
    }
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp
    },
  },
}
</script>

<template>
  <template v-if="mdAndUp">
    <div class="horizontalMenu border-bottom bg-surface position-relative">
      <div :class="customizer.boxed ? 'maxWidth' : 'px-6'">
        <ul class="gap-3 horizontal-navbar mx-lg-0 mx-3">
          <li v-for="(item, i) in sidebarMenu" :key="i" class="navItem">
            <NavCollapse :item="item" :level="0" v-if="item.children" />
            <NavItem :item="item" v-else />
          </li>
        </ul>
      </div>
    </div>
  </template>
  <div v-else class="mobile-menu">
    <VerticalSidebar />
  </div>
</template>
<style lang="scss"></style>
