<script setup lang="ts">
definePageMeta({
  middleware: "user",
});

import { Response, User, Reservation } from "@/types";
import { capital } from "case";
const config = useRuntimeConfig();

const route = useRoute();
const toast = useToast();

const detailUser = ref<User | null>(null);
const loading = reactive<{ button: boolean }>({
  button: false,
});

const fetchDetailUser = async () => {
  try {
    const response: Response<User> = await $fetch(`${config.public.baseUrl}/users/user/${route?.params?.id}`, { method: "GET", withCredentials: true, credentials: "include" });
    detailUser.value = response?.data;
  } catch (error) {
    console.log(error);
  }
};

const cancelReservation = async (id: number) => {
  loading.button = true;
  console.log("wwa");
  try {
    const response: Response<Reservation> = await $fetch(`${config.public.baseUrl}/reserve/reservation/${id}`, { method: "DELETE", withCredentials: true, credentials: "include" });
    if (response.status === 200) {
      toast.add({ title: "Success", description: response.message, color: "green" });
    } else {
      toast.add({ title: "Error", description: response.message, color: "red" });
    }
    return response;
  } catch (error: any) {
    console.log("error", error);
    toast.add({ title: "Error", description: error.data.message, color: "red" });
  } finally {
    loading.button = false;
  }
};

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
            <UBadge :color="reservation?.status === 'APPROVE' ? 'green' : reservation?.status === 'PENDING' ? 'yellow' : reservation?.status === 'REJECT' || 'CANCEL' ? 'red' : 'black'">{{ capital(reservation?.status) }}</UBadge>
          </div>
          <div class="my-5 text-center text-green-500 font-extrabold">{{ reservation.location }}</div>
          <UButton :loading="loading.button" :disabled="reservation.status === 'PENDING' ? false : true" :variant="reservation.status === 'PENDING' ? 'solid' : 'outline'" @click="cancelReservation(reservation?.id)"
            >Cancel Reservations</UButton
          >
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
