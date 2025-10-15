<script>
export default {
  data() {
    return {
      page: { title: "รายละเอียดใบเสนอราคา" },
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
        {
          text: "รายละเอียด",
          disabled: false,
          href: "#",
        },
      ],
    };
  },
  methods: {
    //
  },
  computed: {
    QuotationID() {
      return this.$route.params.QuotationID;
    },
  },
};
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <UiParentCard Tableard title="รายละเอียดใบเสนอราคา">
    QuotationID : {{ QuotationID }}
    <HelloWorld />
  </UiParentCard>
</template>
