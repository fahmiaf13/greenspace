import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const isOfficer = authStore?.user?.role;

  if (isOfficer !== "OFFICER") {
    return abortNavigation();
  }
});
