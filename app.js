import Alpine from 'https://esm.sh/alpinejs'

import { mqttConfig } from './conf.js'
import { MqttCtrl } from './mqtt_ctrl.js'

import './foc_conf.js'
import './alpine_series.js'
import './alpine_enable.js'
import './alpine_loop_mode.js'
import './alpine_limit.js'
import './alpine_pid.js'
import './alpine_loop.js'
import './alpine_target.js'
// import './alpine_chart.js'


// const chartEl = document.getElementById('statesChart');

const app = {
    MAX_LEN: 5000,
    interval: 10,
    prev_ms: 0,
    baseTime: Date.now() - performance.now(),
    mqtt: new MqttCtrl(mqttConfig),
    init () {
        this.mqtt.connect(this.mqttOnConnect.bind(this))
        this.mqtt.onMessage(this.onMessage.bind(this))
    },

    mqttOnConnect () {
        this.mqtt.subscribe(this.mqttOnSubscribe.bind(this))
    },
    
    mqttOnSubscribe (err) {
        if (err) {
            console.error('MQTT subscribe', err)
        } else {
            console.log('MQTT subscribed')
            this.LoadDefaultConf()
            Alpine.start()
        }
    },

    onMessage (topic, message) {
        let msg = JSON.parse(message.toString())

        if (msg.cmd_id && msg.cmd_id >=100) {
            this.UpdateConf(msg)
        } else if (msg.ts) {
            Alpine.store('chartStore').updateStates(msg)
        }
    },

    UpdateConf(cmd)  {
        let conf_key = cmd.cmd_key.replace('conf_', '')
        if (!Alpine.store('foc-conf')[conf_key]) {
            return
        }

        let i = 0
        for (let key in Alpine.store('foc-conf')[conf_key]) {
            if (i == 0) {
                Alpine.store('foc-conf')[conf_key][key] = cmd.first
            } else if (i == 1) {
                Alpine.store('foc-conf')[conf_key][key] = cmd.second
            } else if (i == 2) {
                Alpine.store('foc-conf')[conf_key][key] = cmd.third
            }
            i++
        }

        document.dispatchEvent(new Event(`init:conf:${conf_key}`))
    },

    onPublish(err) {
        if (err) {
            console.error('MQTT publish', err)
        }
    },

    LoadDefaultConf() {
        this.LoadConf('conf_base')
        this.LoadConf('conf_limit')
        this.LoadConf('conf_velocity')
        this.LoadConf('conf_position')
        this.LoadConf('conf_torque')
        this.LoadConf('conf_velocity_pid')
        this.LoadConf('conf_position_pid')
        this.LoadConf('conf_torque_pid')
        this.LoadConf('conf_voltage_offset')
    },

    LoadConf(conf_key) {
        this.mqtt.send(conf_key, 0)
    },
}

app.init()

document.addEventListener('alpine:init', () => {
    Alpine.store('mqtt', {
        send(cmd_id, cmd_val) {
            app.mqtt.send(cmd_id, cmd_val)
        }
    })
})

window.Alpine = Alpine


