<template>
  <ImageGallery
    :images="imageList"
    :base-url="imageUrl"
    @delete-image="handleDeleteImage"
  />
</template>

<script>
import ImageGallery from "./ImageGallery.vue"; // แก้ไข path ให้ถูกต้อง
import { apiUrl } from "@/services/constants";
import serverService from "@/services/serverService";
import Swal from "sweetalert2";

export default {
  name: "CarImages",
  components: {
    ImageGallery,
  },
  props: {
    repairId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageUrl: `${apiUrl}/images/car`,
      imageList: [],
    };
  },
  methods: {
    async handleDeleteImage(imageId) {
      const response = await serverService.deleteCarImagesByID(imageId);
      if (response.data.result) {
        this.imageList = this.imageList.filter(
          (img) => img.ImageCarID !== imageId
        );
        Swal.fire({
          icon: "success",
          title: "Done!",
          text: "ลบรูปภาพแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
    async getCarImages() {
      const response = await serverService.getCarImagesByRepairID(
        this.repairId
      );
      this.imageList = response.data;
    },
    async initialize() {
      await this.getCarImages();
    },
  },
  created() {
    this.initialize();
  },
};
</script>
