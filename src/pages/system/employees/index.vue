<script>
export default {
  data() {
    return {
      page: { title: "ข้อมูลพนักงาน" },
      breadcrumbs: [
        {
          text: "Employee",
          disabled: false,
          href: "#",
        },
        {
          text: "ข้อมูลพนักงาน",
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
  <UiParentCard Tableard title="ตารางข้อมูลพนักงาน">
    <EmployeeTable />
  </UiParentCard>
</template>
