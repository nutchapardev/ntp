<script>
import UiParentCard from "@/components/shared/UiParentCard.vue";
export default {
  components: {
    UiParentCard,
  },
  data() {
    return {
      page: { title: "พรีเซ็ตข้อมูล" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "พรีเซ็ตข้อมูล",
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
    <UiParentCard Tableard title="พรีเซ็ตข้อมูล">
      <PresetTable />
    </UiParentCard>
  </div>
</template>
