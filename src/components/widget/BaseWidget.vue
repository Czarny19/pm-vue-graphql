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
      :data-item="dataItem"
      :variables="variables">
  </WidgetText>

  <WidgetCard
      v-else-if="widget.type === 'Card'"
      :widget="widget"
      :theme="theme"
      :data-item="dataItem"
      :variables="variables">
  </WidgetCard>

  <WidgetLink
      v-else-if="widget.type === 'Link'"
      :widget="widget"
      :theme="theme"
      :data-item="dataItem"
      :variables="variables">
  </WidgetLink>

  <WidgetDivider
      v-else-if="widget.type === 'Divider'"
      :widget="widget"
      :theme="theme">
  </WidgetDivider>

  <WidgetCarousel
      v-else-if="widget.type === 'Carousel'"
      :widget="widget"
      :datasource="datasource"
      :variables="variables">
  </WidgetCarousel>

  <WidgetTable
      v-else-if="widget.type === 'Table'"
      :widget="widget"
      :theme="theme"
      :datasource="datasource"
      :variables="variables">
  </WidgetTable>

  <WidgetTextField
      v-else-if="widget.type === 'Text-Field'"
      :widget="widget"
      :theme="theme"
      :variables="variables">
  </WidgetTextField>

  <WidgetNumberField
      v-else-if="widget.type === 'Number-Field'"
      :widget="widget"
      :theme="theme"
      :variables="variables">
  </WidgetNumberField>

  <WidgetTextArea
      v-else-if="widget.type === 'Text-Area'"
      :widget="widget"
      :theme="theme"
      :variables="variables">
  </WidgetTextArea>

  <WidgetSelect
      v-else-if="widget.type === 'Select'"
      :widget="widget"
      :datasource="datasource"
      :theme="theme"
      :variables="variables">
  </WidgetSelect>

  <WidgetCheckbox
      v-else-if="widget.type === 'Checkbox'"
      :widget="widget"
      :theme="theme"
      :variables="variables">
  </WidgetCheckbox>

  <WidgetButton
      v-else-if="widget.type === 'Button'"
      :widget="widget"
      :theme="theme"
      :variables="variables"
      :form-valid="formValid"
      :form-ref="formRef"
      :data-item="dataItem">
  </WidgetButton>
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
import WidgetSelect from "@/components/widget/input/WidgetSelect.vue";
import WidgetCheckbox from "@/components/widget/input/WidgetCheckbox.vue";
import WidgetNumberField from "@/components/widget/input/WidgetNumberField.vue";
import WidgetButton from "@/components/widget/input/WidgetButton.vue";
import WidgetLink from "@/components/widget/display/WidgetLink.vue";

export default Vue.extend({
  name: 'BaseWidget',
  components: {
    WidgetLink,
    WidgetButton,
    WidgetNumberField,
    WidgetCheckbox,
    WidgetSelect,
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
    variables: Array,
    formValid: Boolean,
    formRef: Object
  }
})
</script>

<style scoped>

</style>