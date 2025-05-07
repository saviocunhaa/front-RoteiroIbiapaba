<template>
    <div class="relative">
        <label class="block text-gray-700 font-medium mb-2">{{ props.label }}</label>
        <input
            v-model="inputModel"            
            :type="inputType"
            :required="props.required"
            :placeholder="props.placeholder"
            class="w-full rounded border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'pr-11': inputType === 'password' }"
        />
        <button 
            v-if="props.type === 'password'" 
            class="absolute right-0  px-3 py-3 mr-1"
            @click="viewPassword">
            <img v-if="inputType === 'password'"
                :src="iconEye"
                alt="icone"
            />
            <img v-else
                :src="iconClosedEye"
                alt="icone"
            />
        </button>

    </div>
</template>

<script setup>

import {ref, watch} from 'vue'
import iconEye from '../../assets/icon_eye.svg'
import iconClosedEye from '../../assets/icon_closed_eye.svg'

    const props = defineProps({
        model: String,
        label: String, 
        type: {
            type: String,
            default: 'text'
        }, 
        required: Boolean, 
        placeholder: String,

    })

    const inputModel = defineModel()

    const inputType= ref()

    watch([props.type], () => {
        inputType.value = props.type
    })

    const viewPassword = (event) => {
        event.preventDefault()
        inputType.value = inputType.value === 'password'
            ? 'text': 'password'
    }

</script>