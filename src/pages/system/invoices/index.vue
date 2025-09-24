<script>
import UiParentCard from "@/components/shared/UiParentCard.vue";
export default {
  components: {
    UiParentCard,
  },
  data() {
    return {
      page: { title: "Invoices" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "Invoices",
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
  <UiParentCard Tableard title="Invoices">
    <HelloWorld />
  </UiParentCard>
</template>
