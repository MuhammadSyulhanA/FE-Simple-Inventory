import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const showToast = (message, type = 'success') => {
    const id = Date.now()

    const toast = {
      id,
      message,
      type,
      progress: 100,
    }

    toasts.value.push(toast)

    /* Progress bar countdown */
    const interval = setInterval(() => {
      const t = toasts.value.find((t) => t.id === id)

      if (t) {
        t.progress -= 2

        if (t.progress <= 0) {
          clearInterval(interval)

          removeToast(id)
        }
      }
    }, 60)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
