<template>
    <button
        :type="type"
        :class="[
            'py-2 px-4 transition font-semibold',
            full ? 'w-full' : 'inline-block',
            rounded ? 'rounded-full' : 'rounded',
            disabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : (
                variant === 'fill' 
                    ? `${colorClasses.fill} ${colorClasses.fillHover}` 
                    : `${colorClasses.outline} ${colorClasses.outlineHover}`
            )
        ]"
        :disabled="disabled"
    >
        <slot>Botão</slot>
    </button>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'button'
    },
    variant: {
        type: String,
        default: 'fill',
        validator: (value) => ['fill', 'outline'].includes(value)
    },
    color: {
        type: String,
        default: 'default', 
        validator: (value) => ['default', 'danger'].includes(value)
    },
    full: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    rounded: {
        type: Boolean,
        default: false
    },
});

const colorClasses = computed(() => {
    const colors = {
        default: {
            fill: 'bg-blue-600 text-white',
            fillHover: 'hover:bg-blue-500',
            outline: 'border border-blue-600 text-blue-600',
            outlineHover: 'hover:bg-blue-100'
        },
        danger: {
            fill: 'bg-red-500 text-white',
            fillHover: 'hover:bg-red-400',
            outline: 'border border-red-500 text-red-500',
            outlineHover: 'hover:bg-red-100'
        },
        dark: {
            fill: 'bg-black text-white',
            fillHover: 'hover:bg-gray-800',
            outline: 'border border-black text-black',
            outlineHover: 'hover:bg-gray-100'
        }
    };
    return colors[props.color];
});
</script>