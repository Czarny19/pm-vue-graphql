<template>
  <div>
    <v-select
        class="pt-3"
        color="accent"
        outlined dense hide-details
        append-icon=""
        :label="prop.label"
        :items="themeColors"
        v-model="displayColor"
        item-color="accent"
    >
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

      <template v-slot:append>
        <div class="editor--color-box" :style="{'background-color': themeColorAsHex}"></div>
      </template>
    </v-select>

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
import {ThemeColors} from "@/lib/types";
import {themeColorsPicker} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorPropColor',
  props: {
    prop: Object,
    theme: Object
  },
  data() {
    return {
      currentProp: {},
      isOpen: false,
      displayColor: '',
      pickerColor: ''
    }
  },
  computed: {
    themeColors(): string [] {
      return themeColorsPicker;
    },
    themeColorAsHex(): string {
      if (this.displayColor === 'custom') {
        return this.pickerColor;
      }

      const displayColor = this.displayColor as keyof ThemeColors;
      return this.theme[displayColor];
    }
  },
  methods: {
    openColorPicker(): void {
      const prop = (this.currentProp as { value: string });
      prop.value = this.pickerColor;
      this.isOpen = true;
    },
    closeColorPicker(): void {
      this.isOpen = false;
    }
  },
  watch: {
    displayColor(): void {
      const prop = (this.currentProp as { value: string });

      if (this.displayColor !== 'custom') {
        prop.value = this.displayColor;
      }
    },
    pickerColor(): void {
      const prop = (this.currentProp as { value: string });
      prop.value = this.pickerColor;
    }
  },
  beforeMount() {
    this.currentProp = this.prop;
    const propValue = (this.currentProp as { value: string }).value;

    if (this.themeColors.includes(propValue)) {
      this.displayColor = propValue;
      this.pickerColor = '';
    } else {
      this.displayColor = 'custom';
      this.pickerColor = propValue;
    }
  }
})
</script>

<style scoped>

</style>