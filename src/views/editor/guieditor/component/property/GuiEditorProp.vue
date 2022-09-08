<template>
  <GuiEditorPropString v-if="prop.type === 'String'" :prop="prop"/>
  <GuiEditorPropColor v-else-if="prop.type === 'Color'" :prop="prop" :theme="theme"/>
  <GuiEditorPropSize v-else-if="prop.type === 'Size'" :prop="prop"/>
  <GuiEditorPropSlider v-else-if="prop.type === 'Slider'" :prop="prop"/>
  <GuiEditorPropBool v-else-if="prop.type === 'Boolean'" :prop="prop"/>
  <GuiEditorPropQuery v-else-if="prop.type === 'Query'" :prop="prop" :queries="queries" :variables="variables"/>
  <GuiEditorPropTable v-else-if="prop.type === 'Table'" :prop="prop" :schema="schema"/>
  <GuiEditorPropTableField v-else-if="prop.type === 'TableField'" :prop="prop" :widget="widget" :schema="schema"/>
  <GuiEditorPropBorder v-else-if="prop.type === 'Border'" :prop="prop"/>
  <GuiEditorPropSelect v-else-if="prop.type === 'Select'" :prop="prop"/>
  <GuiEditorPropDuration v-else-if="prop.type === 'Duration'" :prop="prop"/>
  <GuiEditorPropNumber v-else-if="prop.type === 'Number'" :prop="prop"/>
  <GuiEditorPropVar v-else-if="prop.type === 'Variable'" :prop="prop" :variables="variables"/>
  <GuiEditorPropParam v-else-if="prop.type === 'Param'" :prop="prop" :page="page"/>
  <GuiEditorPropRelation v-else-if="prop.type === 'Relation'" :prop="prop" :widget="widget" :schema="schema"/>
</template>

<script lang="ts">
import Vue from "vue";
import GuiEditorPropString from "@/views/editor/guieditor/component/property/GuiEditorPropString.vue";
import GuiEditorPropColor from "@/views/editor/guieditor/component/property/GuiEditorPropColor.vue";
import GuiEditorPropSize from "@/views/editor/guieditor/component/property/GuiEditorPropSize.vue";
import GuiEditorPropSlider from "@/views/editor/guieditor/component/property/GuiEditorPropSlider.vue";
import GuiEditorPropBool from "@/views/editor/guieditor/component/property/GuiEditorPropBool.vue";
import GuiEditorPropQuery from "@/views/editor/guieditor/component/property/GuiEditorPropQuery.vue";
import GuiEditorPropTableField from "@/views/editor/guieditor/component/property/GuiEditorPropTableField.vue";
import GuiEditorPropBorder from "@/views/editor/guieditor/component/property/GuiEditorPropBorder.vue";
import GuiEditorPropSelect from "@/views/editor/guieditor/component/property/GuiEditorPropSelect.vue";
import GuiEditorPropDuration from "@/views/editor/guieditor/component/property/GuiEditorPropDuration.vue";
import GuiEditorPropNumber from "@/views/editor/guieditor/component/property/GuiEditorPropNumber.vue";
import GuiEditorPropVar from "@/views/editor/guieditor/component/property/GuiEditorPropVar.vue";
import GuiEditorPropTable from "@/views/editor/guieditor/component/property/GuiEditorPropTable.vue";
import GuiEditorPropParam from "@/views/editor/guieditor/component/property/GuiEditorPropParam.vue";
import GuiEditorPropRelation from "@/views/editor/guieditor/component/property/GuiEditorPropRelation.vue";

export default Vue.extend({
  name: 'GuiEditorProp',
  components: {
    GuiEditorPropRelation,
    GuiEditorPropParam,
    GuiEditorPropTable,
    GuiEditorPropVar,
    GuiEditorPropNumber,
    GuiEditorPropDuration,
    GuiEditorPropSelect,
    GuiEditorPropBorder,
    GuiEditorPropTableField,
    GuiEditorPropQuery,
    GuiEditorPropBool,
    GuiEditorPropSlider,
    GuiEditorPropSize,
    GuiEditorPropColor,
    GuiEditorPropString
  },
  props: {
    prop: Object,
    page: Object,
    widget: Object,
    theme: Object,
    queries: Array,
    schema: Array,
    variables: Array
  }
})
</script>

<style scoped>

</style>