import { defineStore } from "pinia";
import { User, Response, Officer } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const token = ref<string | null | undefined>(null);
  const member = ref<User | Officer | null>(null);

  async function login(payload: { identifier: string; password: string; role: string }) {
    if (payload.role === "USER") {
      try {
        const response: Response<User> = await $fetch(`${config.public.baseUrl}/auth/login/user`, { method: "POST", body: payload });
        token.value = response.token;
        member.value = response?.data as User;
        return response;
      } catch (error: any) {
        return error;
      }
    } else if (payload.role === "OFFICER") {
      try {
        const response: Response<Officer> = await $fetch(`${config.public.baseUrl}/auth/login/officer`, { method: "POST", body: payload });
        token.value = response.token;
        member.value = response?.data as Officer;
        return response;
      } catch (error: any) {
        return error;
      }
    } else {
      return { msg: "invalid role" };
    }
  }

  function logout() {
    // const auth = useCookie("auth");
    auth.value = null;

    member.value = null;
    token.value = null;
  }

  return { token, member, login, logout };
});

export type AuthStore = ReturnType<typeof useAuthStore>;
