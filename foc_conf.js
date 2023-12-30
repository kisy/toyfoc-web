import Alpine from 'https://esm.sh/alpinejs'

document.addEventListener('alpine:init', () => {
    Alpine.store('foc-conf', {
        base : {
            voltage_power: 0,
            loop_mode: 0,
            target: 0,
        },

        limit : {
            voltage_limit: 0,
            torque_limit: 0,
            velocity_limit: 0,
        },
    
        velocity : {
            ramp: 0,
            limit:0,
            tf: 0,
        },
        position : {
            ramp: 0,
            limit:0,
            tf: 0,
        },
        torque : {
            ramp: 0,
            limit:0,
            tf: 0,
        },
        velocity_pid : {
            p: 0,
            i: 0,
            d: 0,
        },
        position_pid : {
            p: 0,
            i: 0,
            d: 0,
        },
        torque_pid : {
            p: 0,
            i: 0,
            d: 0,
        },
        voltage_offset : {
            u: 0,
            v: 0,
            w: 0,
        },
        phase_current_u : {
            u: 0,
            v: 0,
            w: 0,
        },
        phase_current_v : {
            u: 0,
            v: 0,
            w: 0,
        },
        phase_current_w : {
            u: 0,
            v: 0,
            w: 0,
        },
    })
})
