<template>
  <VCard elevation="10">
    <v-card-text class="position-relative">
      <div>
        <h3 class="card-title mb-1">Current Visits</h3>
        <h5 class="card-subtitle">Visit from the countries</h5>
      </div>
      <div id="svgMap" class="mt-8"></div>
      <div class="d-flex align-center justify-center ga-1 mt-9">
        <div class="d-flex align-center px-2 text-secondary">
          <span class="h-10 bg-secondary rounded-circle me-2"></span>
          <span class="text-subtitle-1">India</span>
        </div>
        <div class="d-flex align-center px-2 text-primary">
          <span class="h-10 bg-primary rounded-circle me-2"></span>
          <span class="text-subtitle-1">USA</span>
        </div>
        <div class="d-flex align-center px-2 text-purple">
          <span class="h-10 bg-purple rounded-circle me-2"></span>
          <span class="text-subtitle-1">Afghan </span>
        </div>
      </div>
    </v-card-text>
  </VCard>
</template>

<script>
import svgMap from "svgmap";
import "svgmap/dist/svgMap.min.css";

export default {
  name: "CurrentVisitsMap",
  mounted() {
    new svgMap({
      targetElementID: "svgMap",
      mouseWheelZoomEnabled: false,
      hideFlag: true,
      initialZoom: 1.23,
      data: {
        data: {
          countresidents: {
            format: "{0}",
            thousandSeparator: ",",
            thresholdMax: 50000,
            thresholdMin: 1000,
          },
        },
        applyData: "countresidents",
        values: {
          AF: { countresidents: 587, color: "#6352ce" },
          IN: { countresidents: 232, color: "#0cb9c5" },
          US: { countresidents: 42393, color: "#1e88e5" },
        },
      },
    });
  },
};
</script>

<style lang="scss">
.svgMap-map-wrapper {
  background: transparent;
  top: 62%;
  padding-top: 62%;
}
</style>
