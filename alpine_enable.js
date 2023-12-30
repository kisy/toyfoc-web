import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.data('EnableData', () => ({
        enable_serial: true,
        enable_mqtt: false,
        fire_water: false,
        sleep_ms: 1000,

        init() {
            this.$watch('enable_serial', () => {
                Alpine.store('mqtt').send('is_send_serial', this.enable_serial ? 1 : 0)
            })
            this.$watch('enable_mqtt', () => {
                Alpine.store('mqtt').send('is_send_mqtt', this.enable_mqtt ? 1 : 0)
            })
            this.$watch('fire_water', () => {
                Alpine.store('mqtt').send('is_fire_water', this.fire_water ? 1 : 0)
            })
        },

        LoadConf() {
            Alpine.store('mqtt').send('is_mqtt_conf', 1)
            Alpine.store('mqtt').send('loop_ms', this.sleep_ms)
            Alpine.store('mqtt').send('is_send_mqtt', this.enable_mqtt ? 1 : 0)
            Alpine.store('mqtt').send('is_send_serial', this.enable_serial ? 1 : 0)
        },

        SleepMsInput: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('loop_sleep_ms', this.sleep_ms)
            },
        },
    }))
});