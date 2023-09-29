<script setup lang="ts">
definePageMeta({
  middleware: "guest",
});

import { object, string, InferType, array } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { Response, User, Officer } from "~/types";
interface IFormRegister {
  username: string;
  password: string;
  email: string;
  role: string;
}

const toast = useToast();
const router = useRouter();
const loading = reactive({
  button: false,
});

const schema = object({
  username: string().min(6, "Must be at least 8 characters").required("Required"),
  email: string().email("Invalid email").required("Required"),
  password: string().min(8, "Must be at least 8 characters").required("Required"),
  role: string().required("Required"),
});

const listRole = ["USER", "OFFICER"];

type Schema = InferType<typeof schema>;

const state = ref<IFormRegister>({
  username: "",
  password: "",
  email: "",
  role: listRole[0],
});

async function submit(event: FormSubmitEvent<Schema>) {
  loading.button = true;
  try {
    const response: Response<User | Officer> = await $fetch(`${import.meta.env.VITE_BASE_ENDPOINT}/auth/register`, { method: "POST", body: event.data });
    if (response.status === 201) {
      router.push("/login");
    }
  } catch (error: any) {
    toast.add({ title: "Login Failed", description: error.data.message, color: "red" });
  } finally {
    loading.button = false;
  }
}
</script>

<template>
  <UContainer class="flex justify-center items-center h-screen">
    <div class="w-1/3 p-5 bg-white rounded-xl">
      <h1 class="font-extrabold text-center text-2xl">Register</h1>
      <UForm class="flex flex-col gap-3" :schema="schema" :state="state" @submit="submit">
        <UFormGroup label="Username" name="username">
          <UInput autocomplete v-model="state.username" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput autocomplete v-model="state.email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput autocomplete type="password" v-model="state.password" />
        </UFormGroup>
        <UFormGroup label="Role" name="role">
          <USelectMenu v-model="state.role" :options="listRole" />
        </UFormGroup>
        <UButton :loading="loading.button ? true : false" block type="submit">Submit</UButton>
      </UForm>
    </div>
  </UContainer>
</template>
