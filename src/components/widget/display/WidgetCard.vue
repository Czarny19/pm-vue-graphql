<template>
  <v-card
      v-if="visible"
      :style="cssProps"
      :color="cardColor"
      :outlined="argsProps.outlined"
      :elevation="elevation"
      :shaped="argsProps.shaped"
  >
    <v-card-title v-if="title" class="text-h6" :style="{'color': titleColor}">
      {{ title }}
    </v-card-title>

    <v-card-subtitle v-if="subtitle" class="text-start text-body-1" :style="{'color': subtitleColor}">
      {{ subtitle }}
    </v-card-subtitle>

    <v-card-text v-if="text" class="text-start text-body-1 pb-2" :style="{'color': textColor}">
      {{ text }}
    </v-card-text>

    <v-card-actions v-if="argsProps.action1Label || argsProps.action2Label">
      <v-btn v-if="argsProps.action1Label" text :color="action1Color" @click="action1">
        {{ argsProps.action1Label }}
      </v-btn>

      <v-btn v-if="argsProps.action2Label" text :color="action2Color" @click="action2">
        {{ argsProps.action2Label }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetCard',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object,
    datasource: Object,
    variables: Array
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
    data(): never {
      return this.dataItem as never;
    },
    cardColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.backgroundColor);
    },
    title(): string {
      const data = this.data;
      const queryFieldName = this.dataProps.titleQueryFieldName;

      const variables = this.variables as PageVariable[];
      const pageVarId = Number(this.dataProps.titlePageVarId);

      const params = this.$route.params;
      const pageParamName = this.dataProps.titlePageParamName;

      return widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName);
    },
    titleColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.titleColor);
    },
    subtitle(): string {
      const data = this.data;
      const queryFieldName = this.dataProps.subtitleQueryFieldName;

      const variables = this.variables as PageVariable[];
      const pageVarId = Number(this.dataProps.subtitlePageVarId);

      const params = this.$route.params;
      const pageParamName = this.dataProps.subtitlePageParamName;

      return widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName);
    },
    subtitleColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.subtitleColor);
    },
    action1Color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.action1Color);
    },
    action2Color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.action2Color);
    },
    textColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.textColor);
    },
    text(): string {
      const data = this.data;
      const queryFieldName = this.dataProps.textQueryFieldName;

      const variables = this.variables as PageVariable[];
      const pageVarId = Number(this.dataProps.textPageVarId);

      const params = this.$route.params;
      const pageParamName = this.dataProps.textPageParamName;

      return widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName);
    },
    elevation(): number {
      return Number(this.argsProps.elevation);
    }
  },
  methods: {
    action1(): void {
      if (!this.$route.path.startsWith('/admin')) {
        const projectId = this.$route.params.projectId;
        const variables = this.variables as PageVariable[];
        const params = this.$route.params;

        const actions = this.appWidget.propGroups.find((group: { type: string }) => group.type === 'action');
        const action = actions?.props[0] as unknown as ActionProp;

        widget.runWidgetClickAction(action, projectId, this.datasource, this.dataItem, variables, params);
      }
    },
    action2(): void {
      if (!this.$route.path.startsWith('/admin')) {
        const projectId = this.$route.params.projectId;
        const variables = this.variables as PageVariable[];
        const params = this.$route.params;

        const actions = this.appWidget.propGroups.find((group: { type: string }) => group.type === 'action');
        const action = actions?.props[1] as unknown as ActionProp;

        widget.runWidgetClickAction(action, projectId, this.dataItem, this.datasource, variables, params);
      }
    }
  }
})
</script>

<style scoped>

</style>