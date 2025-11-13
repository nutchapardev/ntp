<script>
import UiParentCard from "@/components/shared/UiParentCard.vue";
export default {
  components: {
    UiParentCard,
  },
  data() {
    return {
      page: { title: "Trading" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "ซื้อขายอะไหล่รถยนต์",
          disabled: false,
          href: "#",
        },
      ],
    };
  },
};
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <UiParentCard Tableard title="ซื้อขายอะไหล่รถยนต์">
    <HelloWorld />
  </UiParentCard>
</template>
