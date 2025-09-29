<template>
  <v-container>
    <v-card flat border>
      <v-card-title class="text-h5"> อัพโหลดรูปภาพรถยนต์ </v-card-title>
      <v-card-text>
        <!-- <v-text-field
          label="Repair ID"
          :model-value="repairId"
          variant="outlined"
          density="compact"
          readonly
          class="mb-4"
        ></v-text-field> -->

        <v-row>
          <v-col
            v-for="(item, index) in imageSlots"
            :key="item.uniqueId"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <div class="text-subtitle-1 font-weight-bold text-center mb-2">
              {{ item.imageCarType.ImageCarType }}
            </div>

            <v-sheet
              border
              rounded
              class="d-flex align-center justify-center position-relative clickable-sheet"
              height="150"
              width="100%"
              @click="triggerFileInput(index)"
            >
              <v-btn
                v-if="item.imageCarType.ImageCarTypeID === 99"
                icon="mdi-close"
                size="x-small"
                color="error"
                class="remove-btn"
                @click.stop="removeImageSlot(index)"
              ></v-btn>

              <v-img
                v-if="item.previewUrl"
                :src="item.previewUrl"
                aspect-ratio="1"
                cover
                class="fill-height"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>

              <div v-else class="text-center text-grey">
                <v-icon size="x-large">mdi-camera-plus-outline</v-icon>
                <div>เลือกรูป</div>
              </div>

              <input
                type="file"
                :ref="
                  (el) => {
                    if (el) fileInputs[index] = el;
                  }
                "
                @change="handleFileChange($event, index)"
                accept="image/*"
                style="display: none"
              />
            </v-sheet>
          </v-col>

          <v-col cols="6" sm="4" md="3" lg="2">
            <div
              class="text-subtitle-1 font-weight-bold text-center mb-2 text-transparent"
            >
              เพิ่ม
            </div>
            <v-sheet
              border
              rounded
              class="d-flex align-center justify-center clickable-sheet add-sheet"
              height="150"
              width="100%"
              @click="addOtherImageSlot"
            >
              <div class="text-center text-grey">
                <v-icon size="x-large">mdi-plus-box-outline</v-icon>
                <div>เพิ่มรูปอื่นๆ</div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          size="large"
          prepend-icon="mdi-upload"
          :loading="isUploading"
          :disabled="!canUpload"
          @click="uploadImages"
        >
          อัพโหลดรูปภาพทั้งหมด
        </v-btn>
      </v-card-actions>

      <v-alert
        v-if="uploadStatus"
        :type="uploadStatus"
        :text="uploadMessage"
        closable
        @update:modelValue="uploadStatus = null"
        class="ma-2"
        density="compact"
      ></v-alert>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { server, apiUrl } from "@/services/constants";
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
export default {
  name: "ImageUploaderVuetify",
  props: {
    repairId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageCarTypes: [
        // { ImageCarTypeID: 1, ImageCarType: "ด้านหน้า" },
        // { ImageCarTypeID: 2, ImageCarType: "ด้านหลัง" },
        // { ImageCarTypeID: 3, ImageCarType: "ด้านซ้าย" },
        // { ImageCarTypeID: 4, ImageCarType: "ด้านขวา" },
        // { ImageCarTypeID: 5, ImageCarType: "เฉียงหน้า" },
        // { ImageCarTypeID: 6, ImageCarType: "เฉียงหลัง" },
        // { ImageCarTypeID: 99, ImageCarType: "อื่นๆ" },
      ],
      imageSlots: [],
      fileInputs: [],
      isUploading: false,
      uploadStatus: null,
      uploadMessage: "",
      otherImageCounter: 0,
    };
  },
  created() {
    this.getImageCarTypes().then(() => {
      this.initializeSlots();
    });
  },
  computed: {
    canUpload() {
      return (
        this.repairId && this.imageSlots.some((slot) => slot.file !== null)
      );
    },
  },
  methods: {
    async getImageCarTypes() {
      const response = await serverService.getAllImageCarTypes();
      this.imageCarTypes = response.data.filter(
        (item) => item.ImageCarTypeID != 99
      );
    },
    // NEW: แยกฟังก์ชันการตั้งค่าเริ่มต้นออกมา
    initializeSlots() {
      this.imageSlots = this.imageCarTypes.map((type, index) => ({
        uniqueId: `initial-${index}`,
        imageCarType: type,
        file: null,
        previewUrl: null,
      }));
    },
    // NEW: สร้างฟังก์ชันสำหรับล้างข้อมูลทั้งหมด
    resetUploaderState() {
      this.initializeSlots(); // เรียกใช้ฟังก์ชันตั้งค่าเริ่มต้นใหม่
      this.fileInputs = [];
      this.otherImageCounter = 0;
      // เราอาจจะปล่อยให้ข้อความ success แสดงอยู่สักพักแล้วค่อยหายไป
      setTimeout(() => {
        this.uploadStatus = null;
        this.uploadMessage = "";
      }, 5000); // ให้ข้อความหายไปใน 5 วินาที
    },
    triggerFileInput(index) {
      this.fileInputs[index].click();
    },
    handleFileChange(event, index) {
      const file = event.target.files[0];
      if (file) {
        const targetSlot = this.imageSlots[index];
        targetSlot.file = file;
        // ทำการ revoke URL เก่า (ถ้ามี) เพื่อคืน memory
        if (targetSlot.previewUrl) {
          URL.revokeObjectURL(targetSlot.previewUrl);
        }
        targetSlot.previewUrl = URL.createObjectURL(file);
        event.target.value = "";
      }
    },
    addOtherImageSlot() {
      const newSlot = {
        uniqueId: `other-${this.otherImageCounter++}`,
        imageCarType: { ImageCarTypeID: 99, ImageCarType: "อื่นๆ" },
        file: null,
        previewUrl: null,
      };
      this.imageSlots.push(newSlot);
    },
    removeImageSlot(index) {
      const slotToRemove = this.imageSlots[index];
      // คืน memory ของ preview URL ก่อนลบ
      if (slotToRemove.previewUrl) {
        URL.revokeObjectURL(slotToRemove.previewUrl);
      }
      this.fileInputs.splice(index, 1);
      this.imageSlots.splice(index, 1);
    },
    async uploadImages() {
      if (!this.canUpload) {
        this.uploadStatus = "warning";
        this.uploadMessage = "กรุณาเลือกไฟล์อย่างน้อย 1 รูป";
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการเพิ่มรูปภาพ ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.isUploading = true;
            this.uploadStatus = null;
            this.uploadMessage = "";

            const formData = new FormData();
            formData.append("RepairID", parseInt(this.repairId));

            this.imageSlots.forEach((slot) => {
              if (slot.file) {
                formData.append("images", slot.file);
                formData.append(
                  "ImageCarTypeID",
                  slot.imageCarType.ImageCarTypeID
                );
              }
            });

            try {
              const response = await axios.post(
                `${apiUrl}/imagecar`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    "x-access-token": localStorage.getItem(server.TOKEN_KEY),
                  },
                }
              );

              if (response.data.result) {
                // MODIFIED: เรียกใช้ฟังก์ชันล้างข้อมูลหลังจากอัพโหลดสำเร็จ
                this.resetUploaderState();
                this.uploadStatus = "success";
                this.uploadMessage = "อัพโหลดรูปภาพสำเร็จ!";
                Swal.fire({
                  icon: "success",
                  title: "สำเร็จ",
                  text: "เพิ่มรูปภาพสำเร็จ",
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
            } catch (error) {
              this.uploadStatus = "error";
              this.uploadMessage = "เกิดข้อผิดพลาดในการอัพโหลด";
              console.error("Upload error:", error);
            } finally {
              this.isUploading = false;
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "ไม่สามารถเพิ่มรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.clickable-sheet {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.clickable-sheet:hover {
  background-color: #f5f5f5;
  border-color: #9e9e9e;
}
.add-sheet {
  border-style: dashed;
}
.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
}
.text-transparent {
  color: transparent;
}
</style>
