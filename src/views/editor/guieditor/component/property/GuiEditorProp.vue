<template>
  <GuiEditorPropString v-if="prop.type === 'String'" :prop="prop"/>
  <GuiEditorPropColor v-else-if="prop.type === 'Color'" :prop="prop" :theme="theme"/>
  <GuiEditorPropSize v-else-if="prop.type === 'Size'" :prop="prop"/>
  <GuiEditorPropSlider v-else-if="prop.type === 'Slider'" :prop="prop"/>
  <GuiEditorPropBool v-else-if="prop.type === 'Boolean'" :prop="prop"/>
  <GuiEditorPropQuery v-else-if="prop.type === 'Query'" :prop="prop" :queries="queries"/>
  <GuiEditorPropTableField v-else-if="prop.type === 'TableField'" :prop="prop" :schema="schema"/>
  <GuiEditorPropBorder v-else-if="prop.type === 'Border'" :prop="prop"/>
  <GuiEditorPropSelect v-else-if="prop.type === 'Select'" :prop="prop"/>
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

export default Vue.extend({
  name: 'GuiEditorProp',
  components: {
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
    theme: Object,
    queries: Array,
    schema: Array
  }
})
</script>

<style scoped>

</style>