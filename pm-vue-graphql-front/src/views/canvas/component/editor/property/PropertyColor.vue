<template>
  <div>
    <v-container class="pa-0 pt-2 pb-2">
      <v-row>
        <v-col class="ma-auto pl-0 pr-0" cols="3">
          <div class="text-body-2">{{ prop.label }}:</div>
        </v-col>
        <v-col cols="9">
          <v-select
              class="pa-0"
              color="accent"
              outlined
              flat
              single-line
              dense
              hide-details
              append-icon=""
              :items="themeColors"
              v-model="displayColor"
              item-color="accent">

            <template v-slot:item="{item}">
              <div v-if="item !== 'custom'" class="text-start">
                {{ i18n('theme.' + item) }}
              </div>
              <div v-else class="text-start" @click="openColorPicker">
                {{ i18n('theme.' + item) }}
              </div>
            </template>

            <template v-slot:selection="{item}">
              {{ i18n('theme.' + item) }}
            </template>

          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-auto pl-0 pr-0" cols="3"></v-col>
        <v-col class="pt-1 pl-2" cols="9">{{ themeColorAsHex }}</v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="isOpen" width="360">
      <v-card class="text-center">
        <v-card-title class="mb-4">{{ i18n('theme.pickColor') }}</v-card-title>

        <v-card-text>
          <v-color-picker v-model="pickerColor" show-swatches hide-inputs></v-color-picker>
        </v-card-text>

        <v-divider class="ml-6 mr-6"></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" text color="success" @click="closeColorPicker">{{ i18n('common.ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Colors} from "@/plugins/types";

export default Vue.extend({
  name: 'PropertyColor',
  props: {
    prop: Object,
    theme: Object
  },
  computed: {
    themeColors(): string [] {
      return ['primary_color', 'secondary_color', 'accent_color', 'info_color',
        'success_color', 'error_color', 'text_color_1', 'text_color_2', 'background_color', 'custom']
    },
    themeColorAsHex(): string {
      if (this.displayColor === 'custom') {
        return this.pickerColor
      }

      const displayColor = this.displayColor as keyof Colors
      return this.theme[displayColor]
    }
  },
  data() {
    return {
      currentProp: {},
      isOpen: false,
      displayColor: '',
      pickerColor: ''
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    openColorPicker(): void {
      const prop = (this.currentProp as { value: string })
      prop.value = this.pickerColor
      this.isOpen = true
    },
    closeColorPicker(): void {
      this.isOpen = false
    }
  },
  watch: {
    displayColor() {
      const prop = (this.currentProp as { value: string })

      if (this.displayColor !== 'custom') {
        prop.value = this.displayColor
      }
    },
    pickerColor() {
      const prop = (this.currentProp as { value: string })
      prop.value = this.pickerColor
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
    const propValue = (this.currentProp as { value: string }).value

    if (this.themeColors.includes(propValue)) {
      this.displayColor = propValue
      this.pickerColor = ''
    } else {
      this.displayColor = 'custom'
      this.pickerColor = propValue
    }
  }
})
</script>

<style scoped>

</style>