<template>
  <WidgetContainer
      v-if="widget.type === 'Container'"
      :widget="widget" :theme="theme"
      :datasource="datasource"
      :data-item="dataItem">
  </WidgetContainer>

  <WidgetRow
      v-else-if="widget.type === 'Row'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource"
      :data-item="dataItem">
  </WidgetRow>

  <WidgetColumn
      v-else-if="widget.type === 'Column'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource"
      :data-item="dataItem">
  </WidgetColumn>

  <WidgetText
      v-else-if="widget.type === 'Text'"
      :widget="widget"
      :theme="theme"
      :data-item="dataItem">
  </WidgetText>

  <WidgetCard
      v-else-if="widget.type === 'Card'"
      :widget="widget"
      :theme="theme"
      :data-item="dataItem">
  </WidgetCard>

  <WidgetCarousel
      v-else-if="widget.type === 'Carousel'">
  </WidgetCarousel>

  <WidgetTextField v-else-if="widget.type === 'Text-Field'" :widget="widget" :theme="theme"/>
  <WidgetTable v-else-if="widget.type === 'Table'" :widget="widget" :theme="theme" :datasource="datasource"/>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import WidgetContainer from "@/components/widget/WidgetContainer.vue";
import WidgetRow from "@/components/widget/WidgetRow.vue";
import WidgetColumn from "@/components/widget/WidgetColumn.vue";
import WidgetText from "@/components/widget/WidgetText.vue";
import WidgetTextField from "@/components/widget/WidgetTextField.vue";
import WidgetTable from "@/components/widget/WidgetTable.vue";
import WidgetCard from "@/components/widget/WidgetCard.vue";
import WidgetCarousel from "@/components/widget/WidgetCarousel.vue";

export default Vue.extend({
  name: 'BaseWidget',
  components: {
    WidgetCarousel,
    WidgetCard,
    WidgetTable,
    WidgetTextField,
    WidgetText,
    WidgetColumn,
    WidgetRow,
    WidgetContainer,
  },
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object,
  }
})
</script>

<style scoped>

</style>