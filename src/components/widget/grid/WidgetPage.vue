<template>
  <div :style="{'background-color': theme.background_color}">
    <template v-for="(child) in widget.children">
      <BaseWidget
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :key="child.name"
          :data-item="dataItem"
          :variables="variables"
          :mutations="mutations"
          @showerror="showError"
          @saving="saving"
          @savingdone="savingDone">
      </BaseWidget>
    </template>

    <v-snackbar v-model="errorSnackbar" :color="errColor" :timeout="8000">
      {{ errorMsg }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          {{ i18n('runtime.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetPage',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object,
    variables: Array,
    mutations: Array
  },
  data() {
    return {
      errorSnackbar: false,
      errorMsg: ''
    }
  },
  computed: {
    errColor(): string {
      return widget.getColorPropValue(this.theme, 'error_color')
    }
  },
  methods: {
    showError(error: string): void {
      this.errorMsg = error
      this.errorSnackbar = true
    },
    saving(): void {
      this.$emit('saving')
    },
    savingDone(): void {
      this.$emit('savingdone')
    }
  }
})
</script>

<style scoped>

</style>