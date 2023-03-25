<template>
  <div class="flex flex-col items-start">
    <label :for="`${name}_loan`">{{ name }} loan</label>
    <input
      :id="`${name}_loan`"
      :value="mortgage.loan"
      :type="disableLoan ? 'text' : 'number'"
      min="0"
      step="1000"
      :disabled="disableLoan"
      @input="e => emit('update:loan', getNumberFromEvent(e))"
    />

    <label :for="`${name}_rate`">Interest rate</label>
    <input
      :id="`${name}_rate`"
      :value="mortgage.rate"
      :type="disableRate ? 'text' : 'number'"
      min="0"
      max="100"
      step="0.01"
      :disabled="disableRate"
      @input="e => emit('update:rate', getNumberFromEvent(e))"
    />

    <template v-if="!hideWoz">
      <label :for="`${name}_WOZ`">WOZ-value</label>
      <input
        :id="`${name}_WOZ`"
        :value="mortgage.woz"
        type="number"
        min="0"
        step="1000"
        @input="e => emit('update:woz', getNumberFromEvent(e))"
      />
    </template>

    <div class="grow"></div>

    <div>Rate: €{{ mortgage.monthly }}</div>
    <div>Nett rate: €{{ mortgage.nettMonthly }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Mortgage } from '@/models/mortgage';

defineProps<{
  name: string,
  mortgage: Mortgage,
  disableLoan?: boolean,
  disableRate?: boolean,
  hideWoz?: boolean,
}>();

const emit = defineEmits<{
  (e: 'update:loan', value: number): void,
  (e: 'update:rate', value: number): void,
  (e: 'update:woz', value: number): void,
}>();

const getNumberFromEvent = (event: Event) => {
  return Number((event.target as HTMLInputElement).value);
};
</script>
