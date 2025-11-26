<script>
export default {
  data() {
    return {
      page: { title: "ใบเสนอราคา" },
      breadcrumbs: [
        {
          text: "Invoice",
          disabled: false,
          href: "#",
        },
        {
          text: "ใบเสนอราคา",
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
    <UiParentCard Tableard title="ใบเสนอราคา">
      <QuotationTable />
    </UiParentCard>
  </div>
</template>
