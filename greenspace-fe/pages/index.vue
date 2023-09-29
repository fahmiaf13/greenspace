<script setup lang="ts">
import { ParkingSpot, Response } from "@/types";
const page = ref(1);
const pageCount = 5;
const listParkingSpot = ref<ParkingSpot[]>([]);

const router = useRouter();
const loading = reactive({
  table: false,
});

const rows = computed(() => {
  return listParkingSpot.value.slice((page.value - 1) * pageCount, page.value * pageCount);
});

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "location",
    label: "Location",
  },
  {
    key: "dateTime",
    label: "Date",
  },
  {
    key: "actions",
    label: "Reservation",
  },
];

const fetchListParkingSpot = async () => {
  loading.table = true;
  try {
    const response: Response<ParkingSpot[]> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/parking/spot`, { method: "GET", withCredentials: true, credentials: "include" });
    listParkingSpot.value = response?.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.table = false;
  }
};

onMounted(() => {
  fetchListParkingSpot();
});
</script>

<template>
  <section class="flex justify-center items-center min-h-screen">
    <UContainer class="flex gap-3 items-center">
      <div class="w-1/2">
        <h1 class="font-extrabold text-5xl text-green-500">
          Parking Made Easier, <br />
          More Efficient
        </h1>
        <div>Welcome to the ultimate parking solution for all your needs. Discover a smarter way to manage your parking spaces.</div>
      </div>
      <div class="w-1/2 flex flex-col items-center gap-5 justify-center">
        <UTable :loading="loading.table ? true : false" :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }" class="bg-white rounded-xl p-3 w-full" :rows="rows" :columns="columns">
          <template #actions-data="{ row }">
            <button
              @click="router.push({ path: `reservation/${row.id}` })"
              :disabled="row.available ? false : true"
              :class="`hover:bg-transparent duration-200  ${
                row.available ? 'bg-green-500 border border-green-500 hover:text-green-500 hover:cursor-pointer' : ' bg-red-500 disabled:bg-red-500/80 cursor-not-allowed hover:cursor-not-allowed'
              } text-white py-1 px-3 rounded-md`"
            >
              {{ row.available ? "Book" : "Booked" }}
            </button>
          </template>
        </UTable>
        <UPagination v-model="page" :page-count="pageCount" :total="listParkingSpot.length" />
      </div>
    </UContainer>
  </section>
</template>
