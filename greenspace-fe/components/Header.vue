<script lang="ts" setup>
import { useAuthStore } from "~/store/authStore";
import { capital } from "case";

const authStore = useAuthStore();
const router = useRouter();

const items = [
  [
    {
      label: authStore?.user?.email ?? "",
      slot: "account",
      disabled: true,
    },
  ],

  [
    {
      label: "Profile",
      icon: "i-heroicons-user",
      click: () => {
        router.push(`/user/${authStore?.user?.id}`);
      },
    },
  ],
  [
    {
      label: "Reservation",
      icon: "i-heroicons-book-open",
      click: () => {
        router.push(`/officer/${authStore?.user?.id}`);
      },
    },
    {
      label: "Changelog",
      icon: "i-heroicons-megaphone",
    },
    {
      label: "Status",
      icon: "i-heroicons-signal",
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => authStore.logout(),
    },
  ],
];

onMounted(() => {
  useAuthStore();
});
</script>

<template>
  <nav class="h-24 fixed w-full top-0 left-0 bg-green-500 z-10 text-white">
    <UContainer class="justify-between w-full flex items-center h-full">
      <NuxtLink to="/" class="font-extrabold text-2xl">Greenspace</NuxtLink>
      <div class="flex gap-3" v-if="!authStore.token">
        <NuxtLink to="/login">
          <UButton color="white" class="text-green-500 font-extrabold">LOGIN</UButton>
        </NuxtLink>
        <NuxtLink to="/register">
          <UButton color="white" variant="outline" class="font-extrabold">REGISTER</UButton>
        </NuxtLink>
      </div>
      <div v-else>
        <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }">
          <div class="flex items-center gap-3">
            <div class="flex flex-col justify-center text-end">
              <div class="font-extrabold">{{ authStore.user?.username }}</div>
              <div class="font-light">{{ authStore.user?.role }}</div>
            </div>
            <UAvatar src="https://www.svgrepo.com/show/5125/avatar.svg" size="lg" />
          </div>
          <template #account="{ item }">
            <div class="text-left w-full">
              <p>Signed in as</p>
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ item?.label }}
              </p>
            </div>
          </template>

          <template #item="{ item }">
            <span class="truncate">{{ item?.label }}</span>
            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
          </template>
        </UDropdown>
      </div>
    </UContainer>
  </nav>
</template>

<style></style>
