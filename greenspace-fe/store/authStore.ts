import { defineStore } from "pinia";
import { User, Response } from "~/types";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    token: null as string | null | undefined,
    user: null as User | null,
    message: null as string | null,
  }),
  actions: {
    async login(payload: { identifier: string; password: string; role: string }) {
      if (payload.role === "USER") {
        try {
          const response: Response<User> = await $fetch("http://localhost:3001/auth/login/user", { method: "POST", body: payload });
          this.token = response.token;
          this.user = response?.data as User;
          return response;
        } catch (error: any) {
          return error;
        }
      } else if (payload.role === "OFFICER") {
        try {
          const response: Response<User> = await $fetch("http://localhost:3001/auth/login/officer", { method: "POST", body: payload });
          this.token = response.token;
          this.user = response?.data as User;
          return response;
        } catch (error: any) {
          return error;
        }
      } else {
        return { msg: "invalid role" };
      }
    },
    logout() {
      const auth = useCookie("auth");
      auth.value = null;

      this.user = null;
      this.token = null;
    },
  },
  persist: true,
});
export type AuthStore = ReturnType<typeof useAuthStore>;
