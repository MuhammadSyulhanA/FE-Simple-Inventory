<template>
  <div>
    <!-- HEADER -->

    <h1 class="text-2xl font-semibold mb-6">Dashboard</h1>

    <!-- STAT CARDS -->

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Total Barang</p>
        <p class="text-2xl font-bold">
          {{ totalBarang }}
        </p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Total Stok</p>
        <p class="text-2xl font-bold">
          {{ totalStok }}
        </p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Stok Masuk</p>
        <p class="text-2xl font-bold text-green-600">
          {{ totalMasuk }}
        </p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <p class="text-gray-500 text-sm">Stok Keluar</p>
        <p class="text-2xl font-bold text-red-600">
          {{ totalKeluar }}
        </p>
      </div>
    </div>

    <!-- CHART -->

    <div class="bg-white p-6 rounded shadow">
      <h2 class="mb-4 font-semibold">Grafik Transaksi Bulanan</h2>

      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const chartCanvas = ref(null)

const totalBarang = ref(0)
const totalStok = ref(0)
const totalMasuk = ref(0)
const totalKeluar = ref(0)

onMounted(() => {
  loadStats()
  createChart()
})

/* LOAD DATA */

const loadStats = () => {
  const items = JSON.parse(localStorage.getItem('barang') || '[]')

  const masuk = JSON.parse(localStorage.getItem('stokMasuk') || '[]')

  const keluar = JSON.parse(localStorage.getItem('stokKeluar') || '[]')

  totalBarang.value = items.length

  totalStok.value = items.reduce((sum, item) => sum + item.stok, 0)

  totalMasuk.value = masuk.reduce((sum, item) => sum + Number(item.jumlah), 0)

  totalKeluar.value = keluar.reduce((sum, item) => sum + Number(item.jumlah), 0)
}

/* CHART */

const createChart = () => {
  const masuk = JSON.parse(localStorage.getItem('stokMasuk') || '[]')

  const keluar = JSON.parse(localStorage.getItem('stokKeluar') || '[]')

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const dataMasuk = new Array(12).fill(0)

  const dataKeluar = new Array(12).fill(0)

  masuk.forEach((item) => {
    const month = new Date(item.tanggal).getMonth()

    dataMasuk[month] += Number(item.jumlah)
  })

  keluar.forEach((item) => {
    const month = new Date(item.tanggal).getMonth()

    dataKeluar[month] += Number(item.jumlah)
  })

  new Chart(
    chartCanvas.value,

    {
      type: 'bar',

      data: {
        labels: months,

        datasets: [
          {
            label: 'Masuk',
            data: dataMasuk,
            backgroundColor: 'rgba(34,197,94,0.6)',
          },

          {
            label: 'Keluar',
            data: dataKeluar,
            backgroundColor: 'rgba(239,68,68,0.6)',
          },
        ],
      },
    }
  )
}
</script>