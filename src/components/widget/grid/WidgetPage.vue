<template>
  <div :style="{'background-color': theme.background_color}">
    <template v-for="(child) in widget.children">
      <BaseWidget
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :key="child.name"
          :data-item="dataItem"
          :variables="variables">
      </BaseWidget>
    </template>
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
    dataItem: Object,
    variables: Array
  }
})
</script>

<style scoped>

</style>