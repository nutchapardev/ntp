<script>
export default {
  name: "RepairedChart",

  computed: {
    // 1. ย้าย logic จาก computed() มาไว้ใน property ที่ชื่อ computed
    chartOptions() {
      return {
        series: [50, 40, 30, 10],
        labels: ["Wheels", "Motor", "Check mileage", "Oil change"],
        chart: {
          type: "donut",
          height: 250,
          fontFamily: "inherit",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: true,
            donut: {
              size: "83",
              labels: {
                show: true,
                name: {
                  show: true,
                  offsetY: 7,
                },
                value: {
                  show: false,
                },
                total: {
                  show: true,
                  color: "#a1aab2",
                  fontSize: "13px",
                  label: "Our Repaired",
                },
              },
            },
          },
        },
        colors: [
          "rgba(var(--v-theme-primary))",
          "rgba(var(--v-theme-secondary))",
          "#ecf0f2",
          "rgba(var(--v-theme-purple))",
        ],
        tooltip: {
          enabled: true,
          fillSeriesColor: false,
          marker: {
            show: false,
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
        responsive: [
          {
            breakpoint: 1025,
            options: {
              chart: {
                height: 270,
              },
            },
          },
          {
            breakpoint: 426,
            options: {
              chart: {
                height: 250,
              },
            },
          },
        ],
      }
    },
  },
}
</script>

<template>
  <VCard elevation="10">
    <v-card-text>
      <div>
        <h3 class="card-title mb-1">Our Repaired</h3>
        <h5 class="card-subtitle">Different Catgory Repaired</h5>
      </div>
      <div class="mt-5 pt-5 position-relative">
        <apexchart
          type="donut"
          height="265"
          :options="chartOptions"
          :series="chartOptions.series"
        ></apexchart>
      </div>
    </v-card-text>
  </VCard>
</template>

<style scoped>
.total-sales-icon {
  position: absolute;
  left: 46%;
  top: 45%;
}
</style>
