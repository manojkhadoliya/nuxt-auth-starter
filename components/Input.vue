<template>
  <div>
    <label :for="props.id" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
    </label>
    <div class="mt-2">
      <input
          :type="type"
          :id="id"
          :disabled="disabled"
          :class="
            clsx(
              `
              form-input block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1
              ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
              focus:ring-sky-600 focus:outline-none focus-visible:ring-2 sm:text-sm sm:leading-6`,
              disabled && 'opacity-50 cursor-default'
            )
          "
          v-model="value"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import clsx from 'clsx';

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  modelValue: string | number;
  name:string;
  disabled?: boolean;
}

const props = defineProps<InputProps>();
const emit = defineEmits(['update:modelValue']);

// write get and emit in computed for value to work with v-model
import { computed } from 'vue';

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<style scoped>
/* Add your component styles here */
</style>
