<script>
import { nextTick } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

export default {
  name: "Employee",
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  data() {
    return {
      page: { title: "Vendors" },
      breadcrumbs: [
        {
          text: "Employee",
          disabled: false,
          href: "#",
        },
        {
          text: "ข้อมูลพนักงาน",
          disabled: false,
          href: "#",
        },
      ],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: "#ID",
          key: "id",
          align: "start",
          sortable: true,
        },
        {
          title: "ชื่อคู่ค้า",
          align: "start",
          sortable: false,
          key: "firstName",
        },
        { title: "รหัสประจำตัวประชาชน / เลขที่ผู้เสียภาษี", key: "idNumber" },
        { title: "เบอร์โทรศัพท์", key: "tel" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        titleID: 1,
        firstName: "",
        lastName: "",
        idNumber: null,
        tel: null,
        subDistrictID: null,
        districtID: null,
        provinceID: null,
      },
      defaultItem: {
        titleID: 1,
        firstName: "",
        lastName: "",
        idNumber: null,
        tel: null,
        subDistrictID: null,
        districtID: null,
        provinceID: null,
      },
      title_items: [
        { title: "ไม่ระบุ", value: 1 },
        { title: "นาย", value: 2 },
        { title: "นาง", value: 3 },
        { title: "นางสาว", value: 4 },
        { title: "เด็กชาย", value: 5 },
        { title: "เด็กหญิง", value: 6 },
      ],
      districtItems: [
        { title: "ไม่ระบุ", value: 1 },
        { title: "เขตบางรัก", value: 2 },
        { title: "เขตบางคอแหลม", value: 3 },
        { title: "เขตบางนา", value: 4 },
        { title: "เขตบางพลัด", value: 5 },
      ],
      subDistrictItems: [
        { title: "ไม่ระบุ", value: 1 },
        { title: "แขวงบางรัก", value: 2 },
        { title: "แขวงบางคอแหลม", value: 3 },
        { title: "แขวงบางนา", value: 4 },
        { title: "แขวงบางพลัด", value: 5 },
      ],
      provinceItems: [
        { title: "ไม่ระบุ", value: 1 },
        { title: "กรุงเทพมหานคร", value: 2 },
        { title: "นนทบุรี", value: 3 },
        { title: "ปทุมธานี", value: 4 },
        { title: "สมุทรปราการ", value: 5 },
      ],
      allZipcodeItems: [
        {
          title: "แขวงจอมพล >> เขตจตุจักร >> กรุงเทพมหานคร >> 10900",
          value: 1,
        },
        {
          title: "แขวงบางรัก >> เขตบางรัก >> กรุงเทพมหานคร >> 10500",
          value: 2,
        },
        {
          title: "แขวงบางคอแหลม >> เขตบางคอแหลม >> กรุงเทพมหานคร >> 10120",
          value: 3,
        },
        { title: "แขวงบางนา >> เขตบางนา >> กรุงเทพมหานคร >> 10260", value: 4 },
        {
          title: "แขวงบางพลัด >> เขตบางพลัด >> กรุงเทพมหานคร >> 10700",
          value: 5,
        },
      ],
      venderTypeItems: [
        { title: "บุคคลธรรมดา", value: 1 },
        { title: "นิติบุคคล", value: 2 },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.desserts = [
        {
          id: 1,
          titleID: 2,
          title: "นาย",
          firstName: "สมชาย",
          lastName: "สมบูรณ์",
          idNumber: "1419900237118",
          tel: "0892456337",
        },
        {
          id: 2,
          titleID: 2,
          title: "นาย",
          firstName: "สมศักดิ์",
          lastName: "สมบูรณ์",
          idNumber: "1419900237118",
          tel: "0892456337",
        },
        {
          id: 3,
          titleID: 4,
          title: "นางสาว",
          firstName: "สมหญิง",
          lastName: "สมบูรณ์",
          idNumber: "1419900237118",
          tel: "0892456337",
        },
        {
          id: 4,
          titleID: 4,
          title: "นางสาว",
          firstName: "สมใจ",
          lastName: "สมบูรณ์",
          idNumber: "1419900237118",
          tel: "0892456337",
        },
        {
          id: 5,
          titleID: 2,
          title: "นาย",
          firstName: "สมปอง",
          lastName: "สมบูรณ์",
          idNumber: "1419900237118",
          tel: "0892456337",
        },
      ];
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard Tableard title="ตารางข้อมูลพนักงาน">
        <v-data-table
          class="border rounded-md"
          :headers="headers"
          :items="desserts"
          :sort-by="[{ key: 'id', order: 'desc' }]"
        >
          <template v-slot:top>
            <v-toolbar class="bg-lightsecondary" flat>
              <v-toolbar-title>รายละเอียด</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="700px">
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" variant="flat" dark v-bind="props"
                    >เพิ่มข้อมูล</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title class="pa-4 bg-secondary">
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container class="px-0">
                      <v-row>
                        <v-col cols="12" sm="8" md="8">
                          <v-text-field
                            v-model="editedItem.firstName"
                            label="ชื่อคู่ค้า"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-select
                            :items="venderTypeItems"
                            v-model="editedItem.venderTypeID"
                            label="ประเภทคู่ค้า"
                            hide-details
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="8" md="8">
                          <v-text-field
                            v-model="editedItem.idNumber"
                            label="รหัสประจำตัวประชาชน / เลขที่ผู้เสียภาษี"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="editedItem.tel"
                            label="เบอร์โทรศัพท์"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field label="ที่อยู่"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="d-flex align-center">
                          <v-autocomplete
                            prepend-inner-icon="mdi-magnify"
                            label="ค้นหา"
                            v-model="editedItem.subDistrictID"
                            :items="allZipcodeItems"
                            color="primary"
                            variant="outlined"
                            hide-details
                          ></v-autocomplete>
                        </v-col>
                        <!-- <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            label="แขวง/ตำบล"
                            v-model="editedItem.subDistrictID"
                            :items="subDistrictItems"
                            color="primary"
                            variant="outlined"
                            hide-details
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            label="เขต/อำเภอ"
                            v-model="editedItem.districtID"
                            :items="districtItems"
                            color="primary"
                            variant="outlined"
                            hide-details
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-autocomplete
                            label="จังหวัด"
                            v-model="editedItem.provinceID"
                            :items="provinceItems"
                            color="primary"
                            variant="outlined"
                            hide-details
                          ></v-autocomplete>
                        </v-col> -->
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" variant="flat" dark @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="success" variant="flat" dark @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5 text-center py-6"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="error"
                      variant="flat"
                      dark
                      @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="success"
                      variant="flat"
                      dark
                      @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.firstName="{ item }">
            {{ item.title }} {{ item.firstName }} {{ item.lastName }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              color="info"
              size="small"
              class="me-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon color="error" size="small" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
