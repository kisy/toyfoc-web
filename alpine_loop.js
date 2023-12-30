import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.data('DebugLoopData', () => ({
        which_loop: 'velocity',
        velocity: {
            ramp: 0,
            limit: 0,
            tf: 0,
        },
        position: {
            ramp: 0,
            limit: 0,
            tf: 0,
        },
        torque: {
            ramp: 0,
            limit: 0,
            tf: 0,
        },
        loop: {
            ramp: 0,
            limit: 0,
            tf: 0,
        },

        init() {
            document.addEventListener('init:conf:velocity', () => {
                this.velocity = Object.assign({}, Alpine.store('foc-conf').velocity)
                this.loop = Object.assign({}, Alpine.store('foc-conf').velocity)
            })
            document.addEventListener('init:conf:position', () => {
                this.position = Object.assign({}, Alpine.store('foc-conf').position)
                this.which_loop == 'position' && (this.loop.limit = this.position.limit)
            })
            document.addEventListener('init:conf:torque', () => {
                this.torque = Object.assign({}, Alpine.store('foc-conf').torque)
                this.which_loop == 'torque' && (this.loop.limit = this.torque.limit)
            })

            this.$watch('loop', () => {
                this[this.which_loop].ramp = this.loop.ramp
                this[this.which_loop].limit = this.loop.limit
                this[this.which_loop].tf = this.loop.tf
            })

            this.$watch('which_loop', () => {
                if (this.which_loop == 'velocity') {
                    this.loop.ramp = this.velocity.ramp
                    this.loop.limit = this.velocity.limit
                    this.loop.tf = this.velocity.tf
                } else if (this.which_loop == 'position') {
                    this.loop.ramp = this.position.ramp
                    this.loop.limit = this.position.limit
                    this.loop.tf = this.position.tf
                } else if (this.which_loop == 'torque') {
                    this.loop.ramp = this.torque.ramp
                    this.loop.limit = this.torque.limit
                    this.loop.tf = this.torque.tf
                }
            })
        },

        DebugInputRamp: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send(this.which_loop+'_ramp', this.loop.ramp)
            },
        },
        DebugInputLimit: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send(this.which_loop+'_limit', this.loop.limit)
            },
        },
        DebugInputTF: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send(this.which_loop+'_tf', this.loop.tf)
            },
        },
    }))
})