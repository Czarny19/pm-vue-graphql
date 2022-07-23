<template>
  <v-dialog v-model="isOpen" width="360">
    <template v-slot:activator="{ on, attrs }">
      <v-col :cols="cols.cols" :sm="cols.sm" :md="cols.md" :lg="cols.lg" :xl="cols.xl" class="pt-4 pb-4">
        <v-btn class="pl-2 pr-2 pt-6 pb-6" :color="color" width="100%" v-bind="attrs" v-on="on">
          <v-card color="primary" class="pa-1 mr-auto">{{ label }}: {{ color }}</v-card>
        </v-btn>
      </v-col>
    </template>

    <v-card class="text-center">
      <v-card-title class="mb-4">{{ i18n('theme.pickColor') }}</v-card-title>

      <v-card-text>
        <v-color-picker v-model="pickerColor" show-swatches hide-inputs></v-color-picker>
      </v-card-text>

      <v-divider class="ml-6 mr-6"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-2" text color="success" @click="close">{{ i18n('common.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ThemeColorField',
  props: {
    color: String,
    label: String,
    large: Boolean,
    xlarge: Boolean
  },
  data() {
    return {
      isOpen: false,
      pickerColor: '',
    }
  },
  computed: {
    cols(): { cols: number; sm: number, md: number; lg: number; xl: number } {
      if (this.large) {
        return {cols: 12, sm: 12, md: 12, lg: 6, xl: 6}
      }

      if (this.xlarge) {
        return {cols: 12, sm: 12, md: 12, lg: 12, xl: 12}
      }

      return {cols: 6, sm: 6, md: 6, lg: 4, xl: 4}
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    close(): void {
      this.isOpen = false
    }
  },
  watch: {
    pickerColor(): void {
      this.$emit('updateColor', this.pickerColor)
    }
  },
  beforeMount() {
    this.pickerColor = this.color
  }
})
</script>

<style scoped>

</style>