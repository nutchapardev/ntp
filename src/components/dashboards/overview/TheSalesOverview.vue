<script setup>
import { ref, onMounted, computed } from "vue";

/*Chart*/
const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Income",
        data: [9, 5, 3, 7, 5, 10, 3],
      },
      {
        name: "Expenses",
        data: [6, 3, 9, 5, 4, 6, 4],
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: 330,
      foreColor: "#adb0bb",
      offsetY: 10,
      offsetX: -15,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,.1)",
    },
    colors: ["rgba(var(--v-theme-primary))", "rgba(var(--v-theme-secondary))"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        endingShape: "flat",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    fill: {
      opacity: 1,
      colors: [
        "rgba(var(--v-theme-primary))",
        "rgba(var(--v-theme-secondary))",
      ],
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      marker: {
        show: false,
      },
      y: {
        formatter: function (val) {
          // ใช้ toLocaleString() เพื่อใส่ comma คั่นหลักพันโดยอัตโนมัติ
          return val.toLocaleString() + " THB";
        },
      },
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 767,
        options: {
          stroke: {
            show: false,
            width: 5,
            colors: ["transparent"],
          },
        },
      },
    ],
  };
});
const Chart = {
  series: [
    {
      name: "รายได้",
      data: [93456, 53321, 33578, 77654, 56745, 102213, 33345],
    },
    {
      name: "ค่าใช้จ่าย",
      data: [63422, 37890, 94356, 57677, 48087, 66555, 43457],
    },
  ],
};
</script>

<template>
  <!-- ------------------------------------ -->
  <!-- html -->
  <!-- ------------------------------------ -->
  <VCard elevation="10">
    <v-card-text>
      <div class="d-sm-flex align-center">
        <div>
          <h3 class="card-title mb-1">Sales Overview</h3>
          <h5 class="card-subtitle">รายได้ และ ค่าใช้จ่าย</h5>
        </div>
        <div class="ms-auto mt-sm-0 mt-4">
          <div class="d-flex align-center">
            <div class="d-flex align-center px-2">
              <span class="h-10 bg-primary rounded-circle me-2"></span>
              <span class="font-weight-regular text-subtitle-1 text-primary"
                >รายได้</span
              >
            </div>
            <div class="d-flex align-center px-2">
              <span class="h-10 bg-secondary rounded-circle me-2"></span>
              <span class="font-weight-regular text-subtitle-1 text-secondary"
                >ค่าใช้จ่าย</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <apexchart
          type="bar"
          height="320"
          :options="chartOptions"
          :series="Chart.series"
        ></apexchart>
      </div>
    </v-card-text>
  </VCard>
</template>
