<script>
import { DotsIcon } from "vue-tabler-icons";

export default {
  name: "NavGroup",
  props: {
    item: Object,
  },
  components: {
    DotsIcon,
  },
};
</script>

<template>
  <v-list-subheader
    class="text-uppercase text-13 font-weight-semibold textPrimary d-flex align-items-center"
  >
    <span class="mini-icon"
      ><DotsIcon size="16" stroke-width="1.5" class="iconClass"
    /></span>
    <span class="mini-text">{{ $t(item.header) }}</span>
  </v-list-subheader>
</template>
