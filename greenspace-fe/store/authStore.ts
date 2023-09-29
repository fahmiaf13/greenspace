import { defineStore } from "pinia";
import { User, Response, Officer } from "~/types";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    token: null as string | null | undefined,
    member: null as User | Officer | null,
  }),
  actions: {
    async login(payload: { identifier: string; password: string; role: string }) {
      if (payload.role === "USER") {
        try {
          const response: Response<User> = await $fetch(`http://localhost:3001/auth/login/user`, { method: "POST", body: payload });
          this.token = response.token;
          this.member = response?.data as User;
          return response;
        } catch (error: any) {
          return error;
        }
      } else if (payload.role === "OFFICER") {
        try {
          const response: Response<Officer> = await $fetch(`${import.meta.env.VITE_BASE_DEV}/auth/login/officer`, { method: "POST", body: payload });
          this.token = response.token;
          this.member = response?.data as Officer;
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

      this.member = null;
      this.token = null;
    },
  },
  persist: true,
});
export type AuthStore = ReturnType<typeof useAuthStore>;
