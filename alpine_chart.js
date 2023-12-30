import Alpine from 'https://esm.sh/alpinejs'
import TimeChart from 'https://huww98.github.io/TimeChart/dist/timechart.module.js'

document.addEventListener('alpine:init', () => {
    Alpine.data('AlpineChart', () => ({
        realTime: true,
        statesChart: null,
        series: [],

        init() {
            Alpine.store('chartStore').initSeries()

            this.statesChart = new TimeChart(this.$refs.statesChart, {
                series: Alpine.store('chartStore').series,
                baseTime: this.baseTime,
                xRange: { min: 0, max: 20 * 1000 },
                realTime: this.realTime,
                zoom: {
                    x: {
                        autoRange: true,
                        minDomainExtent: 50,
                    },
                    y: {
                        autoRange: true,
                        minDomainExtent: 1,
                    }
                },
                tooltip: {
                    enabled: true,
                    xFormatter: (x) => new Date(x).toLocaleString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3}),
                },
            });

            document.addEventListener('chart:update', (e) => {
                this.statesChart.update()
            })
            
            window.addEventListener('resize', () => {
                this.statesChart.onResize()
            });
            this.statesChart.onResize()
        },

        EnableRealTime: {
            ['@change.debounce']() {
                this.statesChart.options.realTime = this.realTime
            },
        },
    }))
})