<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'bg-blue-700 text-white transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
      ]"
    >
      <div class="p-6 text-xl font-bold border-b border-blue-600">Inventory</div>

      <nav class="mt-4">
        <router-link to="/dashboard" class="block px-6 py-3 hover:bg-blue-600">
          Dashboard
        </router-link>

        <router-link to="/barang" class="block px-6 py-3 hover:bg-blue-600"> Barang </router-link>

        <router-link to="/stok-masuk" class="block px-6 py-3 hover:bg-blue-600">
          Stok Masuk
        </router-link>

        <router-link to="/stok-keluar" class="block px-6 py-3 hover:bg-blue-600">
          Stok Keluar
        </router-link>

        <router-link to="/laporan" class="block px-6 py-3 hover:bg-blue-600"> Laporan </router-link>

        <router-link to="/rekap" class="block px-6 py-3 hover:bg-blue-600">
          Rekap Transaksi
        </router-link>
      </nav>
    </aside>

    <!-- MAIN AREA -->
    <div class="flex-1 flex flex-col">
      <!-- NAVBAR -->
      <header class="bg-white shadow px-6 py-4 flex justify-between">
        <!-- BURGER BUTTON -->
        <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100">
          <Menu class="w-6 h-6 text-gray-700"></Menu>
        </button>

        <h1 class="font-semibold text-gray-700">Inventory System</h1>

        <button @click="logout" class="text-red-500 hover:underline">Logout</button>
      </header>

      <!-- CONTENT -->
      <main class="p-6">
        <router-view />
      </main>

      <Toast :toasts="toasts" :removeToast="removeToast" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import Toast from '../components/ToastMessage.vue'
import { useToast } from '../composables/useToast'
const { toasts, removeToast } = useToast()

const router = useRouter()

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const logout = () => {
  router.push('/login')
}
</script>