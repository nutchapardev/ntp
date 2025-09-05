<script>
import NavItem from "../NavItem/Index.vue"
import { Icon } from "@iconify/vue"

export default {
  name: "NavCollapse", // สำคัญมากสำหรับการเรียกใช้งานตัวเอง (Recursive)
  props: {
    item: Object,
    level: Number,
  },
  components: {
    NavItem,
    Icon,
    // ไม่ต้องลงทะเบียน NavCollapse ที่นี่ เพราะการตั้งชื่อ (name) ทำให้ Vue รู้จักแล้ว
  },
}
</script>

<template>
  <a class="navItemLink rounded-pill cursor-pointer navcollapse">
    <i class="navIcon"
      ><Icon
        :icon="'solar:' + item.icon"
        height="18"
        width="18"
        :level="level"
        class="dot"
        :class="'text-' + item.BgColor"
    /></i>
    <span class="mr-auto">{{ item.title }}</span>
    <small v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </small>
    <i class="ddIcon ml-2 d-flex align-center"><ChevronDownIcon size="15" /></i>
  </a>
  <ul v-if="item.children" :class="`ddMenu ddLevel-${level + 1}`">
    <li v-for="(subitem, i) in item.children" :key="i" class="navItem">
      <NavCollapse :item="subitem" v-if="subitem.children" :level="level + 1" />
      <NavItem :item="subitem" :level="level + 1" v-else></NavItem>
    </li>
  </ul>
</template>
