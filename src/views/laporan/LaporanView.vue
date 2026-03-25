<template>
  <div>
    <!-- HEADER -->

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Laporan Stok</h1>

      <button
        @click="exportExcel"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export Excel
      </button>
    </div>

    <!-- TABLE -->

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left">Kode</th>

            <th class="px-4 py-3 text-left">Nama Barang</th>

            <th class="px-4 py-3 text-left">Kategori</th>

            <th class="px-4 py-3 text-left">Stok</th>

            <th class="px-4 py-3 text-left">Satuan</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t">
            <td class="px-4 py-2">
              {{ item.kode }}
            </td>

            <td class="px-4 py-2">
              {{ item.nama }}
            </td>

            <td class="px-4 py-2">
              {{ item.kategori }}
            </td>

            <td class="px-4 py-2 font-semibold">
              {{ item.stok }}
            </td>

            <td class="px-4 py-2">
              {{ item.satuan }}
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

const items = ref([])

const loadData = () => {
  const data = localStorage.getItem('barang')

  if (data) {
    items.value = JSON.parse(data)
  }
}

onMounted(() => {
  loadData()
})

/* EXPORT NANTI */
const exportExcel = () => {
  if (items.value.length === 0) {
    alert('Data kosong')

    return
  }

  /* HEADER PROFESIONAL */

  const header = [
    ['LAPORAN STOK BARANG'],

    ['Tanggal Export:', new Date().toLocaleDateString()],

    [],

    ['Kode', 'Nama Barang', 'Kategori', 'Stok', 'Satuan'],
  ]

  /* DATA */

  const data = items.value.map((item) => [
    item.kode,

    item.nama,

    item.kategori,

    item.stok,

    item.satuan,
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([...header, ...data])

  /* SET WIDTH KOLOM */

  worksheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 }]

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Stok')

  /* EXPORT */

  XLSX.writeFile(workbook, `laporan_stok_${Date.now()}.xlsx`)
}
</script>