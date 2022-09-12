<template>
  <div>
    <YesNoDialog
        :dialog="yesNoDialog"
        :title="yesNoDialogTitle"
        :msg="yesNoDialogMsg"
        :theme="theme"
        @choiceclick="continueActions"
    />

    <v-btn
        v-if="visible"
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
        light
        @click="action"
    >
      <span :style="{'color': textColor}">{{ label }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, AppWidget, Mutation, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";
import YesNoDialog from "@/components/widget/dialog/YesNoDialog.vue";

export default Vue.extend({
  name: 'WidgetButton',
  components: {YesNoDialog},
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
  data() {
    return {
      yesNoDialog: false,
      yesNoDialogTitle: '',
      yesNoDialogMsg: '',
      actionIndex: 0
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget;
    },
    visible(): boolean {
      return widget.isWidgetVisible(this.appWidget, this.dataItem);
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme);
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget);
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget);
    },
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color);
    },
    textColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.textColor);
    },
    data(): never {
      return this.dataItem as never;
    },
    label(): string {
      const data = this.data;
      const queryFieldName = this.dataProps.labelQueryFieldName;

      const variables = this.variables as PageVariable[];
      const pageVarId = Number(this.dataProps.labelPageVarId);

      const params = this.$route.params;
      const pageParamName = this.dataProps.labelPageParamName;

      return widget.getDisplayWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName);
    }
  },
  methods: {
    async continueActions(yesNoDialogConfirmed: boolean): Promise<void> {
      this.yesNoDialog = false;

      if (!yesNoDialogConfirmed) {
        this.actionIndex = 0;
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 200));
      await this.action();
    },
    async action(): Promise<void> {
      if (this.formRef) {
        (this.formRef as Vue & { validate: () => boolean }).validate();
      }

      if (this.formRef && !this.formValid) {
        return;
      }

      if (!this.$route.path.startsWith('/admin')) {
        const projectId = this.$route.params.projectId;
        const variables = this.variables as PageVariable[];
        const params = this.$route.params;
        const mutations = this.mutations as Mutation[];

        const actions = this.appWidget.propGroups.find((group: { type: string }) => group.type === 'action');

        for (let i = this.actionIndex; i < (actions?.props ?? []).length; i++) {
          const action = (actions?.props ?? [])[i] as unknown as ActionProp;
          this.actionIndex++;

          if (action.type === 'yesNoDialog') {
            this.yesNoDialogTitle = widget.getPageVariableValue(variables, action.dialogTitleVar);
            this.yesNoDialogMsg = widget.getPageVariableValue(variables, action.dialogMsgVar);
            this.yesNoDialog = true;
            return;
          }

          if (action.type === 'runMutation') {
            this.$emit('saving');
          }

          const result = await widget.runWidgetClickAction(action, projectId, this.datasource, this.dataItem,
              variables, params, mutations);

          if (action.type === 'runMutation') {
            this.$emit('savingdone');
          }

          if (result && (!result.isSuccessful || !result.data)) {
            this.$emit('showerror', widget.getActionErrorMsg(action, variables, result.error));
            this.actionIndex = 0;
            return;
          }
        }
      }

      this.actionIndex = 0;
    }
  }
})
</script>

<style scoped>

</style>