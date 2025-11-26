<script>
import UiParentCard from "@/components/shared/UiParentCard.vue";
export default {
  components: {
    UiParentCard,
  },
  data() {
    return {
      page: { title: "Recieve" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "Recieve",
          disabled: false,
          href: "#",
        },
      ],
    };
  },
};
</script>
<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <UiParentCard Tableard title="Recieve">
      <HelloWorld />
    </UiParentCard>
  </div>
</template>
