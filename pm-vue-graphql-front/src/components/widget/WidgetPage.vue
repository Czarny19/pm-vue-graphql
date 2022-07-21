<template>
  <div>
    <div class="text-start text-body-1 secondary pa-4">
      {{ widget.id }}
    </div>

    <div class="pa-4" :style="{'background-color': theme.background_color}">
      <template v-for="(child) in widget.children">
        <BaseWidget :widget="child" :theme="theme" :key="child.name"/>
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
    theme: Object
  }
})
</script>

<style scoped>

</style>