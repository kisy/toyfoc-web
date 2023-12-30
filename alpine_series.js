import Alpine from 'https://esm.sh/alpinejs'
import { chartLegend, lineColors } from './conf.js'

document.addEventListener('alpine:init', () => {
    Alpine.store('chartStore', {
        series: [],

        initSeries() {
            for (let i in chartLegend) {
                this.series.push({
                    name: chartLegend[i],
                    data: [],
                    lineWidth: 2,
                    color: lineColors[i],
                })
            }
        },

        updateStates (msg) {
            if (!msg.ts) {
                console.error('msg miss ts', msg)
                return
            }
            for (let i in this.series){
                let name = this.series[i].name;
                if (this.series[i].data.length >= this.MAX_LEN) {
                    this.series[i].data.shift();
                }
        
                this.series[i].data.push({
                    x: msg.ts * 1000,
                    y: msg[name],
                });
            }

            document.dispatchEvent(new Event(`chart:update`), { bubbles: true })
        },
    })
    
})