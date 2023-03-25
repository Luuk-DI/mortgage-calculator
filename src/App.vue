<template>
  <header class="flex justify-center w-full pt-8 py-8">
    <div class="flex flex-col items-center">
      <!--<img
        alt="Vue logo"
        src="./assets/logo.svg"
        width="125"
        height="125"
      >-->

      <h1 class="text-center">
        Mortgage Calculator
      </h1>
    </div>
  </header>

  <main class="flex flex-col md:max-w-4xl mx-auto p-8 m-8 border border-slate-200 bg-slate-100 rounded-md">
    <div class="flex flex-row justify-evenly flex-wrap gap-y-8">
      <div class="bg-slate-50 p-4 rounded-md w-min sm:w-max">
        <h2>Selling</h2>

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
      </div>

      <div class="bg-slate-50 p-4 rounded-md w-min sm:w-max">
        <h2>Buying</h2>

        <div class="flex flex-wrap gap-x-4">
          <div class="flex flex-col">
            <label for="buy_amount">Buy for</label>
            <input
              id="but_amount"
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

            <label for="buy_misc">Notary costs</label>
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
        </div>
      </div>
    </div>

    <HorizontalSeparator />

    <div class="flex justify-evenly flex-wrap gap-y-8">
      <div class="bg-slate-50 p-4 rounded-md w-min sm:w-max">
        <h2>
          Current mortgage
        </h2>
        <MortgageForm
          :mortgage="currentMortgage"
          name="Current"
          @update:loan="v => currentMortgage.loan = v"
          @update:rate="v => currentMortgage.rate = v"
          @update:woz="v => currentMortgage.woz = v"
        />
      </div>

      <div class="bg-slate-50 p-4 rounded-md w-min sm:w-max">
        <h2>New mortgages</h2>
        <div class="flex gap-4 flex-wrap">
          <MortgageForm
            :mortgage="newMortgage"
            name="New"
            disable-loan
            @update:rate="v => newMortgage.rate = v"
            @update:woz="v => newMortgage.woz = v"
          />

          <MortgageForm
            :mortgage="newCurrentMortgage"
            name="Renewed"
            disable-loan
            hide-woz
            disable-rate
          />
        </div>

        <HorizontalSeparator />

        <div class="block font-semibold">
          Total nett rate: €{{ totalNettRate }}
        </div>
      </div>
    </div>

    <HorizontalSeparator />

    <div class="w-full flex flex-wrap justify-center gap-8">
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

  <div class="w-full text-center italic text-sm mt-4">
    Last save: {{ saveTime?.toLocaleString('en-GB') ?? "Not saved." }}
  </div>
</template>

<script lang="ts">

</script>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import HorizontalSeparator from '@/components/HorizontalSeparator.vue';
import MortgageForm from '@/components/MortgageForm.vue';
import { Mortgage, round } from '@/models/mortgage';
import { loadSave, reloadSave, resetData, setSave } from '@/models/saveModel';

const loadedData = loadSave();

const currentMortgage = new Mortgage(
  loadedData.currentMortage.loan,
  loadedData.currentMortage.rate,
  loadedData.currentMortage.woz
);

const newMortgage = new Mortgage(
  0,
  loadedData.newMortgage.rate,
  loadedData.newMortgage.woz,
);

const newCurrentMortgage = new Mortgage(0,0,0);

const sell = reactive(loadedData.sell);
const buy = reactive(loadedData.buy);

const saveTime = ref(loadedData.time == null ? null : new Date(loadedData.time));

const sellCash = computed(() => {
  const perc = (1 - sell.agent / 100);
  return sell.amount * perc - sell.remainingMortgage;
});

watch(
  [buy, sellCash, () => sell.remainingMortgage],
  ([buy, sellCash, remainingMortgage]) => {
    // 2% tax
    const buyPercentage = (1 + (buy.agent + 2) / 100);

    newMortgage.loan = Math.round(
      buy.amount * buyPercentage - sellCash - remainingMortgage + buy.misc + buy.bank + buy.notary
    );
  },
  { immediate: true }
);

watch(
  [ () => currentMortgage.values, () => sell.remainingMortgage],
  ([mortgage, remainder]) => {
    newCurrentMortgage.loan = remainder;
    newCurrentMortgage.rate = mortgage.rate;
    newCurrentMortgage.woz = 0; // Have the WOZ tax applied to the new loan.
  },
  { deep: true, immediate: true },
);

const totalNettRate = computed(() =>
  round(newMortgage.nettMonthly.value + newCurrentMortgage.nettMonthly.value, 2)
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
