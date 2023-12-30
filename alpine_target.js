import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.data('TargetData', () => ({
        target: 0.0,

        init() {
            document.addEventListener('init:conf:base', () => {
                this.target = Alpine.store('foc-conf').base.target
            })
        },

        InputChange: {
            ['@change.debounce']() {
                Alpine.store('mqtt').send('target', parseFloat(this.target))
            },
        },
    }))
})