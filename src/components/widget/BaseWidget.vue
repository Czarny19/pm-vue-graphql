<template>
  <WidgetContainer
      v-if="widget.type === 'Container'"
      :widget="widget" :theme="theme"
      :datasource="datasource"
      :data-item="dataItem"
      :variables="variables">
  </WidgetContainer>

  <WidgetRow
      v-else-if="widget.type === 'Row'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource"
      :data-item="dataItem"
      :variables="variables">
  </WidgetRow>

  <WidgetColumn
      v-else-if="widget.type === 'Column'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource"
      :data-item="dataItem"
      :variables="variables">
  </WidgetColumn>

  <WidgetForm
      v-else-if="widget.type === 'Form'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource"
      :data-item="dataItem"
      :variables="variables">
  </WidgetForm>

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

  <WidgetDivider
      v-else-if="widget.type === 'Divider'"
      :widget="widget"
      :theme="theme">
  </WidgetDivider>

  <WidgetCarousel
      v-else-if="widget.type === 'Carousel'"
      :widget="widget"
      :datasource="datasource">
  </WidgetCarousel>

  <WidgetTable
      v-else-if="widget.type === 'Table'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource">
  </WidgetTable>

  <WidgetTextField
      v-else-if="widget.type === 'Text-Field'"
      :widget="widget"
      :theme="theme"
      :variables="variables">
  </WidgetTextField>

  <WidgetTextArea
      v-else-if="widget.type === 'Text-Area'"
      :widget="widget"
      :theme="theme"
      :variables="variables">
  </WidgetTextArea>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import WidgetContainer from "@/components/widget/grid/WidgetContainer.vue";
import WidgetRow from "@/components/widget/grid/WidgetRow.vue";
import WidgetColumn from "@/components/widget/grid/WidgetColumn.vue";
import WidgetText from "@/components/widget/display/WidgetText.vue";
import WidgetTextField from "@/components/widget/input/WidgetTextField.vue";
import WidgetTable from "@/components/widget/display/WidgetTable.vue";
import WidgetCard from "@/components/widget/display/WidgetCard.vue";
import WidgetCarousel from "@/components/widget/display/WidgetCarousel.vue";
import WidgetDivider from "@/components/widget/display/WidgetDivider.vue";
import WidgetForm from "@/components/widget/grid/WidgetForm.vue";
import WidgetTextArea from "@/components/widget/input/WidgetTextArea.vue";

export default Vue.extend({
  name: 'BaseWidget',
  components: {
    WidgetTextArea,
    WidgetForm,
    WidgetDivider,
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
    variables: Array
  }
})
</script>

<style scoped>

</style>