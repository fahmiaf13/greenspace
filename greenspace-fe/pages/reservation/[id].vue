<script setup lang="ts">
definePageMeta({
  middleware: "user",
});
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAuthStore } from "~/store/authStore";
import { Response, ParkingSpot, User, Reservation } from "~/types";

const authStore = useAuthStore();
const route = useRoute();
const date = ref(new Date());
const toast = useToast();
const detailParkingSpot = ref<ParkingSpot | null>(null);
const loading = reactive({
  button: false,
});

interface Payload {
  spotId: number;
  userId: string;
  startTime: Date;
  endTime: Date;
}

const handleDate = (modelData: Date) => {
  date.value = modelData;
};

const fetchDetailParkingSpot = async () => {
  try {
    const response: Response<ParkingSpot> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/parking/spot/${route.params.id}`, { method: "GET", withCredentials: true, credentials: "include" });
    detailParkingSpot.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const submitReservation = async () => {
  loading.button = true;
  const payload: Payload = {
    spotId: Number(route?.params?.id),
    userId: authStore?.member?.id ?? "",
    startTime: new Date(),
    endTime: date.value,
  };
  try {
    const response: Response<Reservation> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/reserve/reservation`, { method: "POST", body: payload, withCredentials: true, credentials: "include" });
    if (response.status === 200) {
      toast.add({ title: "Success", description: response.message, color: "green" });
    } else {
      toast.add({ title: "Error", description: response.message, color: "red" });
    }
  } catch (error: any) {
    console.log(error);
    toast.add({ title: "Error", description: error.data.message, color: "red" });
  } finally {
    loading.button = false;
  }
};

onMounted(() => {
  fetchDetailParkingSpot();
});
</script>

<template>
  <section class="flex min-h-screen items-center w-full">
    <UContainer>
      <h1 class="font-extrabold text-4xl text-green-500 text-center">Reservation</h1>
      <div class="w-full">
        <div class="p-5 bg-white rounded-xl">
          <div class="font-semibold text-sm">Location</div>
          <div>{{ detailParkingSpot?.location }}</div>
          <UFormGroup label="Reserve Date">
            <VueDatePicker :model-value="date" @update:model-value="handleDate"></VueDatePicker>
          </UFormGroup>
          <UButton :loading="loading.button" block @click="submitReservation" class="py-2">Pay By Cash</UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
