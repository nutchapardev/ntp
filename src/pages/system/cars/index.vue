<script>
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

export default {
  name: "รถยนต์",
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  data() {
    return {
      page: { title: "ข้อมูลรถยนต์" },
      breadcrumbs: [
        {
          text: "Customers and Vendors",
          disabled: false,
          href: "#",
        },
        {
          text: "ข้อมูลรถยนต์",
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
    <UiParentCard Tableard title="ข้อมูลรถยนต์">
      <CarTable />
    </UiParentCard>
  </div>
</template>
