<script setup lang="ts">
// definePageMeta({
//   middleware: "officer",
// });
import { Reservation, Response, User, Officer } from "~/types";
import { capital } from "case";

const route = useRoute();
const officerDetail = ref<User | null>(null);
const reservationList = ref<Reservation[]>([]);

const fetchDetailOfficer = async () => {
  try {
    const response: Response<User> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/officers/officer/${route.params.id}`, { method: "GET", withCredentials: true, credentials: "include" });
    officerDetail.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchListReservations = async () => {
  try {
    const response: Response<Reservation[]> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/reserve/list-reservation`, { method: "GET" });
    reservationList.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const reservationHandler = async (action: string, id: Number) => {
  const payload = {
    status: action,
    reservationId: id,
    officerId: route.params.id,
  };
  try {
    const response = await $fetch(`${import.meta.env.VITE_BASE_DEV}/reserve/verify-reservation`, { method: "PUT", body: payload });
    return response;
  } catch (error) {
    console.log(error);
  }
};

watchEffect(() => {
  console.log(officerDetail.value);
  console.log(reservationList.value);
});

onMounted(() => {
  fetchDetailOfficer();
  fetchListReservations();
});
</script>

<template>
  <section class="h-screen justify-center flex flex-col items-center">
    <div>{{ officerDetail?.username }}</div>
    <div class="flex flex-col gap-3 bg-white p-5 rounded-xl">
      <div v-for="reservation in reservationList">
        <UCard>
          <div class="flex justify-between">
            <div class="font-bold">Status:</div>
            <UBadge :color="reservation.status === 'APPROVE' ? 'green' : reservation.status === 'PENDING' ? 'yellow' : reservation.status === 'REJECT' ? 'red' : 'black'">{{ capital(reservation.status) }}</UBadge>
          </div>
          <div class="my-5 text-center text-green-500 font-extrabold">{{ reservation?.ParkingSpot?.location }}</div>
          <div class="w-full flex gap-1">
            <div class="w-1/2">
              <UButton @click="reservationHandler('REJECT', reservation?.id)" color="red" block>Reject</UButton>
            </div>
            <div class="w-1/2">
              <UButton @click="reservationHandler('APPROVE', reservation?.id)" block>Approve</UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
