import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import BarangView from '../views/barang/BarangView.vue'
import StokMasukView from '../views/stok/StokMasukView.vue'
import StokKeluarView from '../views/stok/StokKeluarView.vue'
import LaporanView from '../views/laporan/LaporanView.vue'
import RekapView from '../views/laporan/RekapView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        component: DashboardView,
      },
      {
        path: 'barang',
        component: BarangView,
      },
      {
        path: '/stok-masuk',
        component: StokMasukView,
      },
      {
        path: '/stok-keluar',
        component: StokKeluarView,
      },
      {
        path: '/laporan',
        component: LaporanView,
      },
      {
        path: '/rekap',
        component: RekapView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
