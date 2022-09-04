<template>
  <div>
    <v-btn
        v-for="(label, index) in labels"
        light
        :key="index"
        :style="cssProps"
        :color="color"
        :disabled="argsProps.disabled"
        :block="argsProps.block"
        :depressed="argsProps.depressed"
        :outlined="argsProps.outlined"
        :rounded="argsProps.rounded"
        :text="argsProps.text"
        :x-small="argsProps.size === 'x-small'"
        :small="argsProps.size === 'small'"
        :large="argsProps.size === 'large'"
        :x-large="argsProps.size === 'x-large'"
        @click="action(index)">
      <span :style="{'color': textColor}">{{ label }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, AppWidget, Mutation, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetButton',
  props: {
    widget: Object,
    theme: Object,
    variables: Array,
    formValid: Boolean,
    formRef: Object,
    dataItem: Object,
    datasource: Object,
    mutations: Array
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget)
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget)
    },
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color)
    },
    textColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.textColor)
    },
    data(): never {
      return this.dataItem as never
    },
    labels(): string[] {
      const data = this.data
      const dataPropVal = this.dataProps.labelQueryVarId

      const variables = this.variables as PageVariable[]
      const pagePropVal = Number(this.dataProps.labelPageVarId)

      const params = this.$route.params
      const paramPropVal = this.dataProps.labelParamVarId

      const labels = widget.getDisplayWidgetVarValues(data, dataPropVal, variables, pagePropVal, params, paramPropVal)

      if (labels.includes('<>')) {
        return labels.split('<>')
      }

      if (labels.length) {
        return [labels]
      }

      return []
    }
  },
  methods: {
    async action(index: number): Promise<void> {
      if (this.formRef) {
        (this.formRef as Vue & { validate: () => boolean }).validate()
      }

      if (this.formRef && !this.formValid) {
        return
      }

      if (!this.$route.path.startsWith('/admin')) {
        const projectId = this.$route.params.projectId
        const variables = this.variables as PageVariable[]
        const params = this.$route.params
        const mutations = this.mutations as Mutation[]

        const actions = this.appWidget.propGroups.find((group: { type: string }) => group.type === 'action')

        for (const prop of actions?.props ?? []) {
          const action = prop as unknown as ActionProp

          if (action.type === 'runMutation') {
            this.$emit('saving')
          }

          const result = await widget.runWidgetClickAction(action, projectId, index, this.datasource,
              this.dataItem, variables, params, mutations)

          if (action.type === 'runMutation') {
            this.$emit('savingdone')
          }

          if (result) {
            if (!result.isSuccessful) {
              this.$emit('showerror', result.error)
              return
            }

            if (!result.data) {
              this.$emit('showerror', widget.getActionErrorMsg(action, variables, result.error))
              return
            }
          }
        }
      }
    }
  }
})
</script>

<style scoped>

</style>