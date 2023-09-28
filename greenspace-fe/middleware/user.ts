import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const isUser = authStore?.user?.role;

  if (isUser !== "USER") {
    return abortNavigation();
  }
});
