<template>
  <!-- <v-container fluid> -->
  <!-- <v-card>
    <v-card-text> -->
  <v-row v-if="!images || images.length === 0">
    <v-col>
      <v-sheet border rounded class="pa-8 text-center">
        <v-icon size="x-large" class="mb-4">mdi-image-off-outline</v-icon>
        <p class="text-h6 text-grey">ยังไม่มีรูปภาพในแกลเลอรี</p>
      </v-sheet>
    </v-col>
  </v-row>

  <v-row v-else>
    <v-col
      v-for="image in images"
      :key="image.ImageCarID"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card class="image-card">
        <v-img
          :src="`${baseUrl}/${image.RepairID}/${image.FileName}`"
          :lazy-src="`${baseUrl}/${image.RepairID}/${image.FileName}`"
          aspect-ratio="1"
          cover
          class="align-end image-clickable"
          @click="viewImage(image)"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>

          <v-btn
            icon="mdi-close"
            size="small"
            class="delete-btn"
            @click.stop="requestDelete(image)"
          ></v-btn>
        </v-img>
        <v-card-subtitle class="pt-3 pb-3 text-center">
          {{ image.imageCarType.ImageCarType }}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
  <!-- </v-card-text>
  </v-card> -->

  <v-dialog v-model="isConfirmingDelete" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-h5">
        <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
        ยืนยันการลบ
      </v-card-title>
      <v-card-text>
        คุณต้องการลบรูปภาพ "{{ imageToDelete?.imageCarType.ImageCarType }}"
        ใช่หรือไม่?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancelDelete">ยกเลิก</v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete"
          >ยืนยันการลบ</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isViewing" width="800">
    <v-card>
      <v-toolbar color="black">
        <v-toolbar-title>{{ viewingImageTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="isViewing = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-img :src="viewingImageSrc" contain max-height="80vh"></v-img>
    </v-card>
  </v-dialog>
  <!-- </v-container> -->
</template>

<script>
export default {
  name: "ImageGallery",
  props: {
    images: {
      type: Array,
      required: true,
    },
    baseUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["delete-image"],
  data() {
    return {
      // State สำหรับการลบ
      isConfirmingDelete: false,
      imageToDelete: null,

      // NEW: State สำหรับการดูภาพขยาย
      isViewing: false,
      viewingImageSrc: "",
      viewingImageTitle: "",
    };
  },
  methods: {
    /**
     * เปิด Dialog ยืนยันการลบ
     */
    requestDelete(image) {
      this.imageToDelete = image;
      this.isConfirmingDelete = true;
    },

    /**
     * ยกเลิกการลบ
     */
    cancelDelete() {
      this.isConfirmingDelete = false;
      this.imageToDelete = null;
    },

    /**
     * ยืนยันและส่ง Event การลบ
     */
    confirmDelete() {
      if (this.imageToDelete) {
        this.$emit("delete-image", this.imageToDelete.ImageCarID);
      }
      this.cancelDelete();
    },

    /**
     * NEW: เปิด Dialog เพื่อดูภาพขยาย
     * @param {object} image - Object ของรูปภาพที่ถูกคลิก
     */
    viewImage(image) {
      this.viewingImageSrc = `${this.baseUrl}/${image.RepairID}/${image.FileName}`;
      this.viewingImageTitle = image.imageCarType.ImageCarType;
      this.isViewing = true;
    },
  },
};
</script>

<style scoped>
.image-card {
  position: relative;
  overflow: visible;
}
.delete-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 10;
}
/* NEW: เพิ่ม cursor pointer ให้ผู้ใช้รู้ว่าคลิกได้ */
.image-clickable {
  cursor: pointer;
}
</style>
