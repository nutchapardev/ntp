<script>
import { useAuthStore } from "@/stores/authStore"
import serverService from "@/services/serverService"
import Swal from "sweetalert2"
export default {
  data() {
    const authStore = useAuthStore()
    return {
      authStore,
      /*Location Select*/
      // select: "United States",
      // location: ["United States", "United Kingdom", "India", "Russia"],

      /*Currency Select*/
      // Currencyselect: "US Dollar ($)",
      // Currency: [
      //   "US Dollar ($)",
      //   "United Kingdom (Pound)",
      //   "India (INR)",
      //   "Russia (Ruble)",
      // ],

      /*change password*/
      account: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 8) || "Password must be less than 8 characters",
      ],

      /*personal detail*/
      // namemodel: "Mike Nielsen",
      // storemodel: "Maxima Studio",
      // storemail: "info@modernize.com",
      // storephone: "+91 12345 65478",
      // storeaddress: "814 Howard Street, 120065, India",
    }
  },
  methods: {
    async changePassword() {
      Swal.fire({
        title: "Are you sure?",
        text: " ท่านต้่องการเปลี่ยนรหัสผ่าน ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.changePassword(this.account)
          if (response.data.result) {
            this.authStore.doLogout()
            Swal.fire({
              title: "Success!",
              text: "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่",
              icon: "success",
            })
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.message,
              icon: "error",
            })
          }
        }
      })
    },
  },
}
</script>

<template>
  <v-card elevation="10">
    <v-row class="ma-sm-n2 ma-n1">
      <v-col cols="12" sm="6">
        <v-card elevation="10" height="100%">
          <v-card-item>
            <h5 class="text-h5">Change Profile</h5>
            <div class="text-subtitle-1 text-textPrimary opacity-80 mt-2">
              Change your profile picture from here
            </div>
            <div class="text-center mt-6 mb-6">
              <v-avatar size="120">
                <img
                  src="@/assets/images/profile/user-1.jpg"
                  height="120"
                  alt="image"
                />
              </v-avatar>
            </div>
            <div class="d-flex justify-center">
              <v-btn color="primary" class="mx-2"> Upload</v-btn>
              <v-btn color="error" class="mx-2" variant="outlined">Reset</v-btn>
            </div>
            <div
              class="text-subtitle-1 text-textPrimary opacity-80 text-center my-sm-8 my-6"
            >
              Allowed JPG, GIF or PNG. Max size of 800K
            </div>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card elevation="10" height="100%">
          <v-card-item>
            <h5 class="text-h5">Change Password</h5>
            <div class="text-subtitle-1 text-textPrimary opacity-80 mt-2">
              To change your password please confirm here
            </div>
            <div class="mt-5">
              <v-label class="mb-2 font-weight-medium"
                >Current Password</v-label
              >
              <v-text-field
                color="primary"
                variant="outlined"
                type="password"
                v-model="account.oldPassword"
                :rules="passwordRules"
              />
              <v-label class="mb-2 font-weight-medium">New Password</v-label>
              <v-text-field
                color="primary"
                variant="outlined"
                type="password"
                v-model="account.newPassword"
                :rules="passwordRules"
              />
              <v-label class="mb-2 font-weight-medium"
                >Confirm Password</v-label
              >
              <v-text-field
                color="primary"
                variant="outlined"
                type="password"
                v-model="account.confirmNewPassword"
                :rules="passwordRules"
              />
            </div>
          </v-card-item>
        </v-card>
      </v-col>
      <!-- <v-col cols="12">
        <v-card elevation="10">
          <v-card-item>
            <h5 class="text-h5">Personal Details</h5>
            <div class="text-subtitle-1 text-textPrimary opacity-80 mt-2">
              To change your personal detail , edit and save from here
            </div>
            <div class="mt-5">
              <v-row>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Your Name</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="namemodel"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Store Name</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="storemodel"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Location</v-label>
                  <v-select
                    v-model="select"
                    :items="location"
                    item-title="state"
                    item-value="abbr"
                    label="Select"
                    return-object
                    single-line
                    variant="outlined"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Currency</v-label>
                  <v-select
                    v-model="Currencyselect"
                    :items="Currency"
                    item-title="state"
                    item-value="abbr"
                    label="Select"
                    return-object
                    single-line
                    variant="outlined"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Email</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="email"
                    v-model="storemail"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label class="mb-2 font-weight-medium">Phone</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="storephone"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-label class="mb-2 font-weight-medium">Address</v-label>
                  <v-text-field
                    color="primary"
                    variant="outlined"
                    type="text"
                    v-model="storeaddress"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card-item>
        </v-card>
      </v-col> -->
    </v-row>
    <div class="d-flex justify-end mt-5 pb-3">
      <v-btn color="primary" class="mr-4" @click="changePassword"
        >บันทึกการเปลี่ยนแปลง</v-btn
      >
      <!-- <v-btn size="large" class="bg-lighterror text-error">Cancel</v-btn> -->
    </div>
  </v-card>
</template>
