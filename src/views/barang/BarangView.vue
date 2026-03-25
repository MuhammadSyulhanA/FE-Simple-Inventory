<template>
  <div>
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Data Barang</h2>

      <div class="flex gap-3">
        <!-- SEARCH -->
        <input v-model="search" placeholder="Cari barang..." class="border px-3 py-2 rounded" />

        <button
          @click="openModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Barang
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full">
        <!-- TABLE HEAD -->
        <thead class="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th @click="sortBy('kode')" class="px-4 py-3 text-left cursor-pointer">Kode</th>
            <th @click="sortBy('nama')" class="px-4 py-3 text-left cursor-pointer">Nama</th>
            <th @click="sortBy('kategori')" class="px-4 py-3 text-left cursor-pointer">Kategori</th>
            <th @click="sortBy('stok')" class="px-4 py-3 text-left cursor-pointer">Stok</th>
            <th @click="sortBy('satuan')" class="px-4 py-3 text-left cursor-pointer">Satuan</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>

        <!-- TABLE BODY -->
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3">
              {{ item.kode }}
            </td>

            <td class="px-4 py-3">
              {{ item.nama }}
            </td>

            <td class="px-4 py-3">
              {{ item.kategori }}
            </td>

            <td class="px-4 py-3">
              {{ item.stok }}
            </td>

            <td class="px-4 py-3">
              {{ item.satuan }}
            </td>

            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded',
                  item.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                ]"
              >
                {{ item.stok > 0 ? 'Aktif' : 'Habis' }}
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <button class="text-blue-600 hover:underline mr-3" @click="editItem(item)">
                Edit
              </button>

              <button class="text-red-600 hover:underline" @click="deleteItem(item)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-end mt-4 gap-2">
      <!-- PREV -->
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      <!-- PAGE NUMBER -->
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="['px-3 py-1 border rounded', currentPage === page ? 'bg-blue-600 text-white' : '']"
      >
        {{ page }}
      </button>

      <!-- NEXT -->
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">{{ isEdit ? 'Edit Barang' : 'Tambah Barang' }}</h3>

        <!-- FORM -->

        <div class="space-y-3">
          <input
            v-model="form.kode"
            placeholder="Kode Barang"
            class="w-full border px-3 py-2 rounded"
          />

          <p v-if="errors.kode" class="text-red-500 text-sm">
            {{ errors.kode }}
          </p>

          <input
            v-model="form.nama"
            placeholder="Nama Barang"
            class="w-full border px-3 py-2 rounded"
          />

          <p v-if="errors.nama" class="text-red-500 text-sm">
            {{ errors.nama }}
          </p>

          <select v-model="form.kategori" class="w-full border px-3 py-2 rounded">
            <option value="">Pilih Kategori</option>

            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <input
            v-model.number="form.stok"
            type="number"
            placeholder="Stok"
            class="w-full border px-3 py-2 rounded"
          />

          <p v-if="errors.stok" class="text-red-500 text-sm">
            {{ errors.stok }}
          </p>

          <input
            v-model="form.satuan"
            placeholder="Satuan"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <!-- BUTTON -->

        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">
            Batal
          </button>

          <button
            @click="saveItem"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { computed } from 'vue'
import { useToast } from '../../composables/useToast'

const items = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const errors = ref({})
const search = ref('')
const currentPage = ref(1)
const perPage = 5
const sortKey = ref('')
const sortDirection = ref('asc')
const categories = ref(['Elektronik', 'ATK', 'Furniture', 'Lainnya'])
const { showToast } = useToast()

const form = ref({
  kode: '',
  nama: '',
  kategori: '',
  stok: 0,
  satuan: '',
})

/* LOAD localStorage */
onMounted(() => {
  //   showToast('Selamat datang!')
  //   showToast('Data berhasil dimuat')
  //   showToast('Contoh error', 'error')
  const saved = localStorage.getItem('barang')

  if (saved) {
    items.value = JSON.parse(saved)
  } else {
    items.value = [
      {
        id: 1,
        kode: 'BRG001',
        nama: 'Mouse Logitech',
        kategori: 'Elektronik',
        stok: 0,
        satuan: 'pcs',
      },
      {
        id: 2,
        kode: 'BRG002',
        nama: 'pulpen',
        kategori: 'ATK',
        stok: 0,
        satuan: 'pcs',
      },
      {
        id: 3,
        kode: 'BRG003',
        nama: 'pensil',
        kategori: 'ATK',
        stok: 0,
        satuan: 'pcs',
      },
      {
        id: 4,
        kode: 'BRG004',
        nama: 'kursi',
        kategori: 'Furniture',
        stok: 0,
        satuan: 'pcs',
      },
      {
        id: 5,
        kode: 'BRG005',
        nama: 'meja',
        kategori: 'Furniture',
        stok: 0,
        satuan: 'pcs',
      },
      {
        id: 6,
        kode: 'BRG006',
        nama: 'csd',
        kategori: 'Lainnya',
        stok: 0,
        satuan: 'pcs',
      },
    ]
  }
})

/* AUTO SAVE */
watch(
  items,
  (newItems) => {
    localStorage.setItem('barang', JSON.stringify(newItems))
  },
  { deep: true }
)

const openModal = () => {
  isEdit.value = false

  form.value = {
    kode: '',
    nama: '',
    kategori: '',
    stok: 0,
    satuan: '',
  }

  errors.value = {}

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const editItem = (item) => {
  isEdit.value = true

  editId.value = item.id

  form.value = { ...item }

  errors.value = {}

  showModal.value = true
}

/* VALIDATION */
const validateForm = () => {
  errors.value = {}

  if (!form.value.kode) {
    errors.value.kode = 'Kode wajib diisi'
  }

  if (!form.value.nama) {
    errors.value.nama = 'Nama wajib diisi'
  }

  if (form.value.stok < 0) {
    errors.value.stok = 'Stok tidak boleh negatif'
  }

  return Object.keys(errors.value).length === 0
}

/* SAVE */
const saveItem = () => {
  if (!validateForm()) return

  if (isEdit.value) {
    const index = items.value.findIndex((i) => i.id === editId.value)

    items.value[index] = {
      ...form.value,
      id: editId.value,
    }
  } else {
    items.value.push({
      id: Date.now(),
      ...form.value,
    })
  }

  closeModal()
  showToast(isEdit.value ? 'Barang berhasil diupdate' : 'Barang berhasil ditambahkan')
}

/* DELETE */
const deleteItem = (item) => {
  if (confirm('Yakin ingin menghapus ' + item.nama + '?')) {
    items.value = items.value.filter((i) => i.id !== item.id)
  }

  showToast('Barang berhasil dihapus')
}

/* SEARCH */
const filteredItems = computed(() => {
  let data = items.value.filter((item) => {
    return (
      item.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  if (sortKey.value) {
    data.sort((a, b) => {
      let aVal = a[sortKey.value]
      let bVal = b[sortKey.value]

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortDirection.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  return data
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / perPage)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage

  return filteredItems.value.slice(start, start + perPage)
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}
</script>