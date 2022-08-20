<template>
  <div>
    <div class="text-start text-body-1 secondary pa-4">
      {{ widget.id }}
    </div>

    <div class="fill-height" :style="{'background-color': theme.background_color}">
      <template v-for="(child) in widget.children">
        <BaseWidget
            :widget="child"
            :theme="theme"
            :datasource="datasource"
            :key="child.name"
            :data-item="dataItem">
        </BaseWidget>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'WidgetPage',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object
  }
})
</script>

<style scoped>

</style>