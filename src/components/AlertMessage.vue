<template>
  <div
    v-if="show"
    :class="[
      'fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white',
      type === 'success' ? 'bg-green-500' : 'bg-red-500',
    ]"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: String,
})
</script>