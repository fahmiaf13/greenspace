<script setup lang="ts">
definePageMeta({
  middleware: "guest",
});
import { object, string, InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { useAuthStore } from "@/store/authStore";

interface IFormLogin {
  identifier: string;
  password: string;
}
const tabItems = [
  {
    label: "User",
    slot: "user",
  },
  {
    label: "Officer",
    slot: "officer",
  },
];
const toast = useToast();
const router = useRouter();
const loading = reactive({
  button: false,
});

const authStore = useAuthStore();

const schema = object({
  identifier: string().min(8, "Must be at least 8 characters").required("Required"),
  password: string().min(8, "Must be at least 8 characters").required("Required"),
});

type Schema = InferType<typeof schema>;

const user = ref<IFormLogin>({
  identifier: "",
  password: "",
});

const officer = ref<IFormLogin>({
  identifier: "",
  password: "",
});

const submitUserLogin = async (event: FormSubmitEvent<Schema>) => {
  loading.button = true;

  const payload = { ...event.data, role: "USER" };
  try {
    const response = await authStore.login(payload);

    window.location.reload();
    if (response.status === 200) {
      toast.add({ title: "Login Success", description: response.message, color: "green" });
      router.push("/");
    } else {
      toast.add({ title: "Login Failed", description: response.message, color: "red" });
    }
  } catch (error: any) {
    toast.add({ title: "Login Failed", description: error.data.message, color: "red" });
  } finally {
    loading.button = false;
  }
};

const submitOfficerLogin = async (event: FormSubmitEvent<Schema>) => {
  loading.button = true;

  const payload = { ...event.data, role: "OFFICER" };
  try {
    const response = await authStore.login(payload);
    if (response.status === 200) {
      toast.add({ title: "Login Success", description: response.message, color: "green" });
      router.push("/");
    } else {
      toast.add({ title: "Login Failed", description: response.message, color: "red" });
    }
  } catch (error: any) {
    toast.add({ title: "Login Failed", description: error.data.message, color: "red" });
  } finally {
    loading.button = false;
  }
};
</script>

<template>
  <UContainer class="flex justify-center items-center h-screen">
    <div class="w-1/3 p-5 bg-white rounded-xl">
      <h1 class="font-extrabold text-center text-2xl">Login</h1>
      <UTabs :items="tabItems">
        <template #user="{ item }">
          <h1 class="text-center my-5 font-bold">
            Login as <span class="text-green-500">{{ item.label }}</span>
          </h1>
          <UForm class="flex flex-col gap-5" :schema="schema" :state="user" @submit="submitUserLogin">
            <UFormGroup label="Email" name="identifier">
              <UInput autocomplete v-model="user.identifier" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
              <UInput autocomplete v-model="user.password" type="password" />
            </UFormGroup>
            <UButton :loading="loading.button ? true : false" block type="submit" class="py-3">Submit</UButton>
          </UForm>
        </template>
        <template #officer="{ item }">
          <h1 class="text-center my-5 font-bold">
            Login as <span class="text-green-500">{{ item.label }}</span>
          </h1>
          <UForm class="flex flex-col gap-5" :schema="schema" :state="officer" @submit="submitOfficerLogin">
            <UFormGroup label="Email" name="identifier">
              <UInput autocomplete v-model="officer.identifier" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
              <UInput autocomplete v-model="officer.password" type="password" />
            </UFormGroup>
            <UButton :loading="loading.button ? true : false" block class="py-3" type="submit">Submit</UButton>
          </UForm>
        </template>
      </UTabs>
    </div>
  </UContainer>
</template>
