<template>
    <canvas ref="chart"></canvas>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
      return {
          chart: null,
      }
  },

  props: ['options', 'chartData'],

  methods: {
      renderChart() {
            const ctx = this.$refs.chart.getContext("2d");
            console.log("data", this.chartData)
            this.chart = new Chart(ctx, {
                type: 'line',
                data: this.chartData,
                options: this.options
            })  
      }
  },

  mounted () {
    this.renderChart()
  }
}
</script>
