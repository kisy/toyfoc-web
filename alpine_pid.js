import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.data('DebugPIDData', () => ({
        which_pid: 'velocity',
        velocity: {
            p: 0,
            i: 0,
            d: 0,
        },
        position: {
            p: 0,
            i: 0,
            d: 0,
        },
        torque: {
            p: 0,
            i: 0,
            d: 0,
        },
        pid: {
            p: 0,
            i: 0,
            d: 0,
        },

        init() {
            document.addEventListener('init:conf:velocity_pid', () => {
                this.velocity = Object.assign({}, Alpine.store('foc-conf').velocity_pid)
                this.pid = Object.assign({}, this.velocity)
            })
            document.addEventListener('init:conf:position_pid', () => {
                this.position = Alpine.store('foc-conf').position_pid
            })
            document.addEventListener('init:conf:torque_pid', () => {
                this.torque = Alpine.store('foc-conf').torque_pid
            })

            this.$watch('pid', () => {
                this[this.which_pid].p = this.pid.p
                this[this.which_pid].i = this.pid.i
                this[this.which_pid].d = this.pid.d
                if (this.which_pid == 'velocity') {
                    Alpine.store('foc-conf').velocity_pid = Object.assign({}, this.velocity)
                } else if (this.which_pid == 'position') {
                    Alpine.store('foc-conf').position_pid = Object.assign({}, this.position)
                } else if (this.which_pid == 'torque') {
                    Alpine.store('foc-conf').torque_pid = Object.assign({}, this.torque)
                }
            })

            this.$watch('which_pid', () => {
                this.pid.p = this[this.which_pid].p
                this.pid.i = this[this.which_pid].i
                this.pid.d = this[this.which_pid].d
            })
        },

        DebugInputP: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send(this.which_pid+'_p', this.pid.p)
            },
        },
        DebugInputI: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send(this.which_pid+'_i', this.pid.i)
            },
        },
        DebugInputD: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send(this.which_pid+'_d', this.pid.d)
            },
        },
    }))
})