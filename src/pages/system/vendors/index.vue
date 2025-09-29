<script>
import { nextTick } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

export default {
  name: "Vendors",
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  data() {
    return {
      page: { title: "Vendors" },
      breadcrumbs: [
        {
          text: "Customers and Vendors",
          disabled: false,
          href: "#",
        },
        {
          text: "Vendors",
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
  <UiParentCard Tableard title="ตารางข้อมูลคู่ค้า">
    <VendorTable />
  </UiParentCard>
</template>
