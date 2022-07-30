<template>
  <div>
    <div class="text-start text-body-1 secondary pa-4">
      {{ widget.id }}
    </div>

    <div class="pa-4 fill-height" :style="{'background-color': theme.background_color}">
      <template v-for="(child) in widget.children">
        <BaseWidget
            :widget="child"
            :theme="theme"
            :datasource="datasource"
            :datasource-secret="datasourceSecret"
            :key="child.name">
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
    datasourceSecret: String
  }
})
</script>

<style scoped>

</style>