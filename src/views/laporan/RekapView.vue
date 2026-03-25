<template>
  <div>
    <!-- HEADER -->

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Rekap Masuk/Keluar</h1>

      <button
        @click="exportExcel"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export Excel
      </button>
    </div>

    <!-- FILTER -->

    <div class="bg-white shadow rounded-lg p-4 mb-4 flex gap-4">
      <input type="date" v-model="dateFrom" class="border px-3 py-2 rounded" />

      <input type="date" v-model="dateTo" class="border px-3 py-2 rounded" />

      <button @click="filterData" class="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
    </div>

    <!-- TABLE -->

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left">Tanggal</th>

            <th class="px-4 py-3 text-left">Barang</th>

            <th class="px-4 py-3 text-left">Jenis</th>

            <th class="px-4 py-3 text-left">Jumlah</th>

            <th class="px-4 py-3 text-left">Catatan</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredData" :key="item.id" class="border-t">
            <td class="px-4 py-2">
              {{ item.tanggal }}
            </td>

            <td class="px-4 py-2">
              {{ item.namaBarang }}
            </td>

            <td class="px-4 py-2">
              <span
                :class="
                  item.jenis === 'MASUK'
                    ? 'text-green-600 font-semibold'
                    : 'text-red-600 font-semibold'
                "
              >
                {{ item.jenis }}
              </span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'

const stokMasuk = ref([])
const stokKeluar = ref([])

const mergedData = ref([])
const filteredData = ref([])

const dateFrom = ref('')
const dateTo = ref('')

/* LOAD DATA */

const loadData = () => {
  const sm = localStorage.getItem('stokMasuk')
  const sk = localStorage.getItem('stokKeluar')

  if (sm) {
    stokMasuk.value = JSON.parse(sm)
  }

  if (sk) {
    stokKeluar.value = JSON.parse(sk)
  }

  mergeData()
}

/* MERGE */

const mergeData = () => {
  const masuk = stokMasuk.value.map((item) => ({
    ...item,

    jenis: 'MASUK',
  }))

  const keluar = stokKeluar.value.map((item) => ({
    ...item,

    jenis: 'KELUAR',
  }))

  mergedData.value = [...masuk, ...keluar].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

  filteredData.value = mergedData.value
}

/* FILTER */

const filterData = () => {
  if (!dateFrom.value || !dateTo.value) {
    filteredData.value = mergedData.value

    return
  }

  filteredData.value = mergedData.value.filter((item) => {
    return item.tanggal >= dateFrom.value && item.tanggal <= dateTo.value
  })
}

/* EXPORT */

const exportExcel = () => {
  if (filteredData.value.length === 0) {
    alert('Data kosong')

    return
  }

  const header = [
    ['REKAP STOK MASUK & KELUAR'],

    ['Tanggal Export:', new Date().toLocaleDateString()],

    [],

    ['Tanggal', 'Barang', 'Jenis', 'Jumlah', 'Catatan'],
  ]

  const data = filteredData.value.map((item) => [
    item.tanggal,

    item.namaBarang,

    item.jenis,

    item.jumlah,

    item.catatan,
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([...header, ...data])

  worksheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 30 }]

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Transaksi')

  XLSX.writeFile(workbook, `rekap_transaksi_${Date.now()}.xlsx`)
}

onMounted(() => {
  loadData()
})
</script>