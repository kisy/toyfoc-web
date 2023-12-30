import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.data('LoopMode', () => ({
        mode: 1,

        init() {
            document.addEventListener('init:conf:base', () => {
                this.mode = Alpine.store('foc-conf').base.loop_mode
            })
        },

        LoopModeInput: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('loop_mode', this.mode)
                Alpine.store('foc-conf').base.loop_mode = this.mode
            },
        },
    }))

})
