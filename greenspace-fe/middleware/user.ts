import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const isUser = authStore?.member?.role;
  const token = authStore?.token;

  if (isUser !== "USER" && !token) {
    return navigateTo("/");
  }
});
