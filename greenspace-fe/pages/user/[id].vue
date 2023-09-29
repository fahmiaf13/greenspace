<script setup lang="ts">
definePageMeta({
  middleware: "user",
});

import { Response, User, Reservation } from "@/types";
import { capital } from "case";

const route = useRoute();
const detailUser = ref<User | null>(null);

const fetchDetailUser = async () => {
  try {
    const response: Response<User> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/users/user/${route.params.id}`, { method: "GET", withCredentials: true, credentials: "include" });
    detailUser.value = response?.data;
  } catch (error) {
    console.log(error);
  }
};

const cancelReservation = async (id: number) => {
  try {
    const response: Response<Reservation> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/reserve/reservation/${id}`, { method: "DELETE", withCredentials: true, credentials: "include" });
    return response;
  } catch (error) {
    console.log(error);
  }
};

watchEffect(() => {
  console.log(detailUser.value);
});

onMounted(() => {
  fetchDetailUser();
});
</script>

<template>
  <div class="h-screen justify-center flex flex-col items-center">
    <div>{{ detailUser?.username }}</div>
    <div class="flex flex-col gap-3 bg-white p-5 rounded-xl">
      <div v-for="reservation in detailUser?.reservations ?? []">
        <UCard>
          <div class="flex justify-between">
            <div class="font-bold">Status:</div>
            <UBadge :color="reservation?.status === 'APPROVE' ? 'green' : reservation?.status === 'PENDING' ? 'yellow' : reservation?.status === 'REJECT' ? 'red' : 'black'">{{ capital(reservation?.status) }}</UBadge>
          </div>
          <div class="my-5 text-center text-green-500 font-extrabold">{{ reservation.location }}</div>
          <UButton @click="cancelReservation(reservation?.id)">Cancel Reservations</UButton>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
