<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <AlertMessage :show="showAlert" :message="alertMessage" :type="alertType" />

    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Inventory Login</h1>

      <!-- Form -->
      <form @submit.prevent="handleLogin">
        <!-- Username -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2"> Username </label>

          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            class="w-full px-4 py-2 border rounded-lg"
            :class="errors.username ? 'border-red-500' : ''"
          />

          <p v-if="errors.username" class="text-red-500 text-sm mt-1">
            {{ errors.username }}
          </p>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label class="block text-gray-700 mb-2"> Password </label>

          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-2 border rounded-lg"
            :class="errors.password ? 'border-red-500' : ''"
          />

          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertMessage from '../../components/AlertMessage.vue'

const router = useRouter()

const username = ref('')
const password = ref('')

const errors = ref({})

const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('success')

const handleLogin = () => {
  errors.value = {}

  // VALIDASI KOSONG
  if (!username.value) {
    errors.value.username = 'Username wajib diisi'
  }

  if (!password.value) {
    errors.value.password = 'Password wajib diisi'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  // LOGIN DUMMY
  if (username.value === 'admin' && password.value === '123456') {
    alertType.value = 'success'
    alertMessage.value = 'Login berhasil!'
    showAlert.value = true

    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } else {
    errors.value.username = 'Username atau password salah'
    errors.value.password = 'Username atau password salah'

    alertType.value = 'error'
    alertMessage.value = 'Login gagal!'
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
    }, 2000)
  }
}
</script>