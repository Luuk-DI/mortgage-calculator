<template>
  <div class="bg-white/50 p-4 rounded-md flex flex-col items-center flex-grow">
    <h2>
      <slot name="title"></slot>
    </h2>

    <div class="flex flex-col items-center">
      <slot></slot>
    </div>
  </div>
</template>
