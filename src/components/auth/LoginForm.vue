<script>
import { useAuthStore } from "@/stores/authStore"
import { Form } from "vee-validate"

/*Social icons*/
// import google from "@/assets/images/svgs/google-icon.svg";
// import facebook from "@/assets/images/svgs/facebook-icon.svg";

export default {
  // 1. ลงทะเบียนคอมโพเนนต์ที่นำเข้ามา
  components: {
    Form,
  },

  // 2. ย้าย ref ทั้งหมดมาไว้ใน data()
  data() {
    return {
      checkbox: false,
      valid: false,
      show1: false,
      username: "nutcha",
      password: "password",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 8) || "Password must be less than 8 characters",
      ],
      usernameRules: [
        (v) => !!v || "Username is required",
        // (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      // ทำให้ icon ใช้งานใน template ได้
      // google: google,
      // facebook: facebook,
    }
  },

  // 3. ย้ายฟังก์ชันทั้งหมดมาไว้ใน methods
  methods: {
    validate(values, { setErrors }) {
      const authStore = useAuthStore()
      return authStore
        .doLogin({ Username: this.username, Password: this.password })
        .catch((error) => setErrors({ apiError: error }))
    },
  },
}
</script>

<template>
  <!-- <v-row class="d-flex mb-3">
    <v-col cols="6" sm="6" class="pr-2">
      <v-btn
        variant="outlined"
        size="large"
        class="border text-subtitle-1"
        block
      >
        <img :src="google" height="16" class="mr-2" alt="google" />
        <span class="d-sm-flex d-none mr-1">Sign in with</span>Google
      </v-btn>
    </v-col>
    <v-col cols="6" sm="6" class="pl-2">
      <v-btn
        variant="outlined"
        size="large"
        class="border text-subtitle-1"
        block
      >
        <img
          :src="facebook"
          width="25"
          height="25"
          class="mr-1"
          alt="facebook"
        />
        <span class="d-sm-flex d-none mr-1">Sign in with</span>FB
      </v-btn>
    </v-col>
  </v-row> -->
  <!-- <div class="d-flex align-center text-center mb-6">
    <div
      class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative"
    >
      <span class="bg-surface px-5 py-3 position-relative"
        >or sign in with</span
      >
    </div>
  </div> -->
  <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText"
      >Username</v-label
    >
    <VTextField
      v-model="username"
      :rules="usernameRules"
      class="mb-8"
      required
      hide-details="auto"
    ></VTextField>
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText"
      >Password</v-label
    >
    <VTextField
      v-model="password"
      :rules="passwordRules"
      required
      hide-details="auto"
      type="password"
      class="pwdInput"
    ></VTextField>
    <!-- <div class="d-flex flex-wrap align-center my-3 ml-n2">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v) => !!v || 'You must agree to continue!']"
        required
        hide-details
        color="primary"
      >
        <template v-slot:label> Remeber this Device </template>
      </v-checkbox>
      <div class="ml-sm-auto">
        <RouterLink
          to=""
          class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
          >Forgot Password ?</RouterLink
        >
      </div>
    </div> -->
    <v-btn
      class="mt-10"
      size="large"
      :loading="isSubmitting"
      color="primary"
      :disabled="valid"
      block
      type="submit"
      flat
      >Sign In</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
