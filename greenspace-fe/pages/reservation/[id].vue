<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAuthStore } from "~/store/authStore";
import { Response, ParkingSpot, User } from "~/types";

const authStore = useAuthStore();
const route = useRoute();
const date = ref(new Date());
const detailParkingSpot = ref<ParkingSpot | null>(null);

interface Payload {
  spotId: number;
  userId: string;
  startTime: Date;
  endTime: Date;
}

const fetchDetailParkingSpot = async () => {
  try {
    const response: Response<ParkingSpot> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/parking/spot/${route.params.id}`, { method: "GET" });
    detailParkingSpot.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const payload: Payload = {
  spotId: Number(route?.params?.id),
  userId: authStore?.user?.id ?? "",
  startTime: new Date(),
  endTime: date.value,
};

const submitReservation = async () => {
  try {
    const response = await $fetch(`${import.meta.env.VITE_BASE_DEV}/reserve/reservation`, { method: "POST", body: payload });
    console.log(response);
  } catch (error) {
    console.log(error);
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
            <VueDatePicker v-model="date"></VueDatePicker>
          </UFormGroup>
          <UButton block @click="submitReservation" class="py-2">Pay By Cash</UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
