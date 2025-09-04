<script>
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
// import TheRevenueCards from "@/components/dashboards/classic/TheRevenueCards.vue";
import TheBandwidthUsage from "@/components/dashboards/general/TheBandwidthUsage.vue";
import TheDownloadCount from "@/components/dashboards/general/TheDownloadCount.vue";
import TotalVisitors from "@/components/dashboards/classic/TotalVisitors.vue";
import CurrentVisits from "@/components/dashboards/classic/CurrentVisits.vue";
import BlogCard from "@/components/dashboards/general/BlogCard.vue";
import NewsletterCampaign from "@/components/dashboards/general/NewsletterCampaign.vue";
import TheMonthTable from "@/components/dashboards/classic/TheMonthTable.vue";
import TheProfileCard from "@/components/dashboards/classic/ProfileCard.vue";
import TheRecentComments from "@/components/dashboards/classic/TheRecentComments.vue";
import TheTodoList from "@/components/dashboards/classic/TheTodoList.vue";

export default {
  name: "ClassicDashboard",
  components: {
    BaseBreadcrumb,
    // TheRevenueCards,
    TheBandwidthUsage,
    TheDownloadCount,
    TotalVisitors,
    CurrentVisits,
    BlogCard,
    NewsletterCampaign,
    TheMonthTable,
    TheProfileCard,
    TheRecentComments,
    TheTodoList,
  },
  data() {
    return {
      page: { title: "Dashboard" },
      breadcrumbs: [
        {
          text: "Home",
          disabled: false,
          href: "#",
        },
        {
          text: "Dashboard",
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
  <v-row>
    <!-- <v-col cols="12" sm="12" lg="12" class="mt-3">
      <TheRevenueCards />
    </v-col> -->
    <v-col cols="12" sm="12" lg="4">
      <TheBandwidthUsage />
      <div class="mt-7"></div>
      <TheDownloadCount />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TotalVisitors />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <CurrentVisits />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <BlogCard />
    </v-col>
    <v-col cols="12" sm="12" lg="8">
      <NewsletterCampaign />
    </v-col>
    <v-col cols="12" sm="12" lg="8">
      <TheMonthTable />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TheProfileCard />
    </v-col>
    <v-col cols="12" sm="12" lg="6">
      <TheRecentComments />
    </v-col>
    <v-col cols="12" sm="12" lg="6">
      <TheTodoList />
    </v-col>
  </v-row>
</template>
