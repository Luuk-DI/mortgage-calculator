<template>
  <header class="flex justify-center w-full pt-8 py-8">
    <div class="flex flex-col items-center">
      <h1 class="text-center">
        Mortgage Calculator
      </h1>
    </div>
  </header>

  <main
    class="
      flex flex-col max-w-2xl sm:max-w-4xl mx-auto p-8 m-8
      md:border border-y border-slate-200 md:rounded-md bg-slate-100
    "
  >
    <ContentBox>
      <template #title>
        Settings
      </template>

      <div class="flex items-center">
        <label for="enable_selling">Include selling</label>
        <input
          id="enable_selling"
          v-model="sell.enabled"
          type="checkbox"
          class="ml-2"
        />
      </div>
    </ContentBox>

    <HorizontalSeparator />

    <div class="flex flex-row justify-evenly flex-wrap gap-8">
      <ContentBox v-if="sell.enabled">
        <template #title>
          Selling
        </template>

        <label for="sell_amount">Sell for</label>
        <input
          id="sell_amount"
          v-model="sell.amount"
          type="number"
          min="0"
          step="1000"
        />

        <label for="sell_agent">Real estate agent %</label>
        <input
          id="sell_agent"
          v-model="sell.agent"
          type="number"
          min="0"
          step="0.1"
        />

        <label for="current_remaining">Remaining of loan</label>
        <input
          id="current_remaining"
          v-model="sell.remainingMortgage"
          type="number"
          min="0"
          step="1000"
        />
      </ContentBox>

      <ContentBox>
        <template #title>
          Buying
        </template>

        <ColumnRow>
          <div class="flex flex-col">
            <label for="buy_amount">Buy for</label>
            <input
              id="buy_amount"
              v-model="buy.amount"
              type="number"
              min="0"
              step="1000"
            />

            <label for="buy_woz">WOZ-value</label>
            <input
              id="buy_woz"
              v-model="newMortgage.woz"
              type="number"
              min="0"
              step="1000"
            />

            <label for="buy_rate">Interest Rate</label>
            <input
              id="buy_rate"
              v-model="newMortgage.rate"
              type="number"
              min="0"
              step="0.01"
            />

            <label for="buy_agent">Real estate agent %</label>
            <input
              id="buy_agent"
              v-model="buy.agent"
              type="number"
              min="0"
              step="0.1"
            />
          </div>

          <div class="flex flex-col">
            <label for="buy_bank">Mortgage costs</label>
            <input
              id="buy_bank"
              v-model="buy.bank"
              type="number"
              min="0"
              step="100"
            />

            <label for="buy_notary">Notary costs</label>
            <input
              id="buy_notary"
              v-model="buy.notary"
              type="number"
              min="0"
              step="100"
            />

            <label for="buy_tax">Tax</label>
            <input
              id="buy_tax"
              type="number"
              :value="buy.amount * 0.02"
              disabled
            />

            <label for="buy_misc">Other costs</label>
            <input
              id="buy_misc"
              v-model="buy.misc"
              type="number"
              min="0"
              step="100"
            />
          </div>
        </ColumnRow>
      </ContentBox>
    </div>

    <HorizontalSeparator />

    <div class="flex justify-evenly flex-wrap gap-8">
      <ContentBox v-if="sell.enabled">
        <template #title>
          Current mortgage
        </template>

        <template #default>
          <MortgageForm
            :mortgage="currentMortgage"
            name="Current"
            @update-loan="onUpdateCurrentLoan"
            @update-rate="onUpdateCurrentRate"
            @update-woz="onUpdateCurrentWoz"
          />
        </template>
      </ContentBox>

      <ContentBox>
        <template #title>
          {{ sell.enabled ? 'New mortgages' : 'New mortgage' }}
        </template>

        <ColumnRow>
          <MortgageForm
            :mortgage="newMortgage"
            name="New"
            disable-loan
            :highlight-nett="!sell.enabled"
            @update-rate="onUpdateRate"
            @update-woz="onUpdateWoz"
          />

          <MortgageForm
            v-if="sell.enabled"
            :mortgage="newCurrentMortgage"
            name="Renewed"
            disable-loan
            hide-woz
            disable-rate
          />
        </ColumnRow>

        <template v-if="sell.enabled">
          <HorizontalSeparator />

          <div class="block font-semibold">
            Total nett rate: €{{ totalNettRate }}
          </div>
        </template>
      </ContentBox>
    </div>

    <HorizontalSeparator class="hidden md:block" />

    <div
      class="
        w-full flex flex-wrap justify-center
        fixed bottom-0 left-0 right-0 bg-slate-300 p-3 gap-2 z-10
        md:relative md:bottom-auto md:left-auto md:right-auto md:bg-transparent md:p-0 md:gap-8 md:z-0
      "
    >
      <button
        type="button"
        @click="e => { saveData(); (e.target as HTMLButtonElement).blur(); }"
      >
        Save
      </button>

      <button
        type="button"
        @click="e => { reloadSave(); (e.target as HTMLButtonElement).blur(); }"
      >
        Reload saved data
      </button>

      <button
        type="button"
        @click="e => { resetData(); (e.target as HTMLButtonElement).blur(); }"
      >
        Reset
      </button>
    </div>
  </main>

  <div class="w-full text-center italic text-sm mt-4 pb-24">
    Last save: {{ saveTime?.toLocaleString('en-GB') ?? "Not saved." }}
  </div>
</template>

<script setup vapor lang="ts">
import ContentBox from '@/components/ContentBox.vue';
import HorizontalSeparator from '@/components/HorizontalSeparator.vue';
import MortgageForm from '@/components/MortgageForm.vue';
import { Mortgage, round } from '@/models/mortgage';
import { loadSave, reloadSave, resetData, setSave } from '@/models/saveModel';
import { computed, reactive, ref, watch } from 'vue';
import ColumnRow from './components/ColumnRow.vue';

const loadedData = loadSave();

const currentMortgage = new Mortgage(
  loadedData.currentMortage.loan,
  loadedData.currentMortage.rate,
  loadedData.currentMortage.woz,
);

const newMortgage = new Mortgage(
  0,
  loadedData.newMortgage.rate,
  loadedData.newMortgage.woz,
);

const onUpdateCurrentLoan = (newLoan: number) => {
  currentMortgage.loan = newLoan;
};

const onUpdateCurrentRate = (newRate: number) => {
  currentMortgage.rate = newRate;
};

const onUpdateCurrentWoz = (newWoz: number) => {
  currentMortgage.woz = newWoz;
};

const onUpdateRate = (newRate: number) => {
  newMortgage.rate = newRate;
};

const onUpdateWoz = (newWoz: number) => {
  newMortgage.woz = newWoz;
};

const newCurrentMortgage = new Mortgage(0, 0, 0);

const sell = reactive(loadedData.sell);
const buy = reactive(loadedData.buy);

const saveTime = ref(loadedData.time == null ? null : new Date(loadedData.time));

const sellCash = computed(() => {
  if (!sell.enabled) {
    return 0;
  }

  const perc = (1 - sell.agent / 100);
  return sell.amount * perc - sell.remainingMortgage;
});

watch(
  [buy, sellCash, () => sell.remainingMortgage],
  ([buy, sellCash, remainingMortgage]) => {
    // 2% tax
    const buyPercentage = (1 + (buy.agent + 2) / 100);

    newMortgage.loan = Math.round(
      buy.amount * buyPercentage - sellCash - remainingMortgage * (sell.enabled ? 1 : 0) + buy.misc + buy.bank + buy.notary,
    );
  },
  { immediate: true },
);

watch(
  [() => currentMortgage.values, () => sell.remainingMortgage],
  ([mortgage, remainder]) => {
    newCurrentMortgage.loan = remainder;
    newCurrentMortgage.rate = mortgage.rate;
    newCurrentMortgage.woz = 0; // Have the WOZ tax applied to the new loan.
  },
  { deep: true, immediate: true },
);

const totalNettRate = computed(() =>
  round(newMortgage.nettMonthly.value + newCurrentMortgage.nettMonthly.value, 2),
);

const saveData = () => {
  saveTime.value = setSave({
    currentMortage: currentMortgage.values,
    sell,
    buy,
    newMortgage: {
      rate: newMortgage.rate,
      woz: newMortgage.woz,
    },
  });
};
</script>
