<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-3">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="bg-white shadow-lg rounded-lg overflow-hidden w-72"
      >
        <!-- CONTENT -->

        <div class="flex items-start gap-3 p-4">
          <!-- ICON -->

          <div>
            <CheckCircle v-if="toast.type === 'success'" class="w-6 h-6 text-green-500" />

            <XCircle v-else class="w-6 h-6 text-red-500" />
          </div>

          <!-- MESSAGE -->

          <div class="flex-1 text-sm text-gray-700">
            {{ toast.message }}
          </div>

          <!-- CLOSE -->

          <button @click="removeToast(toast.id)" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <!-- PROGRESS BAR -->

        <div class="h-1 bg-gray-200">
          <div
            class="h-full transition-all duration-100"
            :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
            :style="{
              width: toast.progress + '%',
            }"
          />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { CheckCircle, XCircle } from 'lucide-vue-next'

defineProps({
  toasts: Array,
  removeToast: Function,
})
</script>

<style scoped>
/* SLIDE ANIMATION */

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>