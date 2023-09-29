import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const isOfficer = authStore?.member?.role;
  const token = authStore?.token;

  if (isOfficer !== "OFFICER" && !token) {
    return navigateTo("/");
  }
});
