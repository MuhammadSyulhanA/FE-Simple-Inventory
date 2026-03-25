<template>
  <div>
    <!-- HEADER -->

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Stok Masuk</h1>

      <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Tambah Stok
      </button>
    </div>

    <!-- TABLE -->

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-600">
          <tr>
            <th class="px-4 py-3 text-left">Tanggal</th>
            <th class="px-4 py-3 text-left">Barang</th>
            <th class="px-4 py-3 text-left">Jumlah</th>
            <th class="px-4 py-3 text-left">Catatan</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in stokMasuk" :key="item.id" class="border-t">
            <td class="px-4 py-2">
              {{ item.tanggal }}
            </td>

            <td class="px-4 py-2">
              {{ item.namaBarang }}
            </td>

            <td class="px-4 py-2">
              {{ item.jumlah }}
            </td>

            <td class="px-4 py-2">
              {{ item.catatan }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
    >
      <div class="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Tambah Stok Masuk</h2>

        <!-- Barang -->

        <select v-model="form.barangId" class="w-full border rounded px-3 py-2 mb-3">
          <option value="">Pilih Barang</option>

          <option v-for="barang in barangList" :key="barang.id" :value="barang.id">
            {{ barang.nama }}
          </option>
        </select>

        <!-- Jumlah -->

        <input
          v-model.number="form.jumlah"
          type="number"
          placeholder="Jumlah"
          class="w-full border rounded px-3 py-2 mb-3"
        />

        <!-- Tanggal -->

        <input v-model="form.tanggal" type="date" class="w-full border rounded px-3 py-2 mb-3" />

        <!-- Catatan -->

        <textarea
          v-model="form.catatan"
          placeholder="Catatan"
          class="w-full border rounded px-3 py-2 mb-3"
        />

        <!-- BUTTON -->

        <div class="flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 border rounded">Batal</button>

          <button @click="simpanStok" class="px-4 py-2 bg-blue-600 text-white rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

const isModalOpen = ref(false)

const stokMasuk = ref([])
const barangList = ref([])

const form = ref({
  barangId: '',
  jumlah: 0,
  tanggal: '',
  catatan: '',
})

/* MODAL */

const openModal = () => {
  form.value = {
    barangId: '',
    jumlah: 0,
    tanggal: '',
    catatan: '',
  }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

/* SIMPAN */

const simpanStok = () => {
  if (!form.value.barangId || !form.value.jumlah || !form.value.tanggal) {
    showToast('Semua field wajib diisi', 'error')

    return
  }

  const barang = barangList.value.find((b) => b.id === form.value.barangId)

  const newData = {
    id: Date.now(),

    tanggal: form.value.tanggal,

    namaBarang: barang.nama,

    jumlah: form.value.jumlah,

    catatan: form.value.catatan,
  }

  stokMasuk.value.push(newData)

  /* UPDATE STOK BARANG */

  barang.stok += form.value.jumlah

  saveLocalStorage()

  showToast('Stok berhasil ditambahkan')

  closeModal()
}

/* LOCAL STORAGE */

const saveLocalStorage = () => {
  localStorage.setItem('stokMasuk', JSON.stringify(stokMasuk.value))

  localStorage.setItem('barang', JSON.stringify(barangList.value))
}

const loadLocalStorage = () => {
  const sm = localStorage.getItem('stokMasuk')
  const brg = localStorage.getItem('barang')

  if (sm) {
    stokMasuk.value = JSON.parse(sm)
  }

  if (brg) {
    barangList.value = JSON.parse(brg)
  }
}

/* INIT */

onMounted(() => {
  loadLocalStorage()
})
</script>