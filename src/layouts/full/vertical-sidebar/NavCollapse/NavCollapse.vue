<script>
import NavItem from "../NavItem/index.vue"

export default {
  name: "NavCollapse", // สำคัญมากสำหรับการเรียกใช้งานตัวเอง (Recursive)
  props: {
    item: Object,
    level: Number,
  },
  components: {
    NavItem,
  },
}
</script>

<template>
  <v-list-group no-action v-if="item.children">
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :value="item.title"
        rounded="pill"
        class="mb-1"
      >
        <template v-slot:prepend>
          <Icon
            :icon="'solar:' + item.icon"
            height="18"
            width="18"
            class="dot"
            :class="'text-' + item.BgColor"
            :level="level"
          />
        </template>
        <v-list-item-title class="mr-auto">{{
          $t(item.title)
        }}</v-list-item-title>
        <v-list-item-subtitle
          v-if="item.subCaption"
          class="text-caption mt-n1 hide-menu"
        >
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse :item="subitem" v-if="subitem.children" :level="level + 1" />
      <NavItem :item="subitem" :level="level + 1" v-else></NavItem>
    </template>
  </v-list-group>
</template>
