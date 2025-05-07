<template>
  <div>
    <label v-if="label" class="block text-gray-700 font-medium mb-2">{{ label }}</label>
    <Multiselect
        v-model="modelModel"
        :options="options"
        :placeholder="placeholder"
        :searchable="searchable"
        :multiple="multiple"
        :noOptionsText="prBr.noOptionsText"
        :noResultsText="prBr.noResultsText"
        :selectLabel="prBr.selectLabel"
        :deselectLabel="prBr.deselectLabel"
        class="w-full"
    />
  </div>
</template>

<script setup>
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  label: String,
  placeholder: {
    type: String,
    default: 'Selecione uma opção',
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
})

const modelModel = defineModel()

const prBr = {
    noOptionsText: 'Nenhuma opção disponível',
    noResultsText: 'Nenhum resultado encontrado',
    selectLabel: 'Clique para selecionar',
    deselectLabel: 'Clique para remover',
}


</script>