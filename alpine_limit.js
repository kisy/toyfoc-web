import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.data('DataLimit', () => ({
        voltage_power: 0.0,
        voltage_limit: 0.0,
        torque_limit: 0.0,
        velocity_limit: 0.0,

        init() {
            document.addEventListener('init:conf:base', () => {
                this.voltage_power = Alpine.store('foc-conf').base.voltage_power
            })
            document.addEventListener('init:conf:limit', () => {
                this.voltage_limit = Alpine.store('foc-conf').limit.voltage_limit
                this.torque_limit = Alpine.store('foc-conf').limit.torque_limit
                this.velocity_limit = Alpine.store('foc-conf').limit.velocity_limit
            })
        },

        InputVoltagePower: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('voltage_power', parseFloat(this.voltage_power))
            },
        },
        InputVoltageLimit: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('voltage_limit', parseFloat(this.voltage_limit))
            },
        },
        InputTorqueLimit: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('torque_limit', parseFloat(this.torque_limit))
                Alpine.store('foc-conf').torque.limit = parseFloat(this.torque_limit)
                document.dispatchEvent(new Event(`init:conf:torque`))
            },
        },
        InputVelocityLimit: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('velocity_limit', parseFloat(this.velocity_limit))
                Alpine.store('foc-conf').position.limit = parseFloat(this.velocity_limit)
                document.dispatchEvent(new Event(`init:conf:position`))
            },
        },
    }))
})