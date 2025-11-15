<template>
  <div
    class="
      relative bg-white/50 p-4 rounded-md flex flex-col items-center flex-grow border border-slate-200/0
      focus-within:bg-white/75 focus-within:border-slate-200 transition-colors duration-300
    "
  >
    <h2>
      <slot name="title"></slot>
    </h2>

    <div class="flex flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script setup vapor lang="ts"></script>
