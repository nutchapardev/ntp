<script setup>
import { ref } from "vue";

import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
// UiTittleSubtitleCard is imported but not used, you might want to remove it.
// import UiTittleSubtitleCard from "@/components/shared/UiTittleSubtitleCard.vue";
import TheSalesOverview from "@/components/dashboards/overview/TheSalesOverview.vue";
import TotalSales from "@/components/dashboards/overview/TotalSales.vue";
import BlogCard from "@/components/dashboards/overview/BlogCard.vue";
import NewsletterCampaign from "@/components/dashboards/overview/NewsletterCampaign.vue";
import TheBandwidthUsage from "@/components/dashboards/overview/TheBandwidthUsage.vue";
import TheDownloadCount from "@/components/dashboards/overview/TheDownloadCount.vue";
import TheWeatherCard from "@/components/dashboards/overview/TheWeatherCardVue.vue";
import TheProfileCard from "@/components/dashboards/overview/TheProfileCard.vue";
import TheMyContacts from "@/components/dashboards/overview/TheMyContacts.vue";
import TheActivityTimeline from "@/components/dashboards/overview/TheActivityTimeline.vue";
import SnackBar from "@/components/dashboards/snackbar.vue";

const page = ref({ title: "Dashboard" });
const breadcrumbs = ref([
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
]);
</script>

<template>
  <!-- <SnackBar /> -->
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12" lg="8">
      <TheSalesOverview />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TotalSales />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <BlogCard />
    </v-col>
    <v-col cols="12" sm="12" lg="8">
      <NewsletterCampaign />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TheBandwidthUsage />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TheDownloadCount />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TheWeatherCard />
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <TheProfileCard />
      <div class="mt-7"></div>
      <TheMyContacts />
    </v-col>
    <v-col cols="12" sm="12" lg="8">
      <TheActivityTimeline />
    </v-col>
  </v-row>
</template>
