<script>
export default {
  name: "Monitoring",
  data() {
    return {
      page: { title: "จัดสรรอุปกรณ์" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "จัดสรรอุปกรณ์",
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
  <UiParentCard Tableard title="รอจัดสรรอุปกรณ์">
    <MonitoringCard />
  </UiParentCard>
</template>
