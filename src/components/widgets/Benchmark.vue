<script setup>
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import * as ChartImport from 'chart.js';

const props = defineProps(['ylabel', 'ytype', 'datas']);

const {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
} = ChartImport;
Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LogarithmicScale);

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      type: props.ytype,
      title: {
        display: true,
        text: props.ylabel,
      },
    },
  },
};

const chartId = ref('bar-chart');
const datasetIdKey = ref('label');
const plugins = ref([]);
const cssClasses = ref('');
const styles = ref({});
const width = ref(400);
const height = ref(200);

const chartData = JSON.parse(props.datas);

</script>

<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>
