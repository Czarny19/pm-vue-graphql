<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-6 pb-2">
      <v-container class="pa-2 pl-4 pr-4">
        <v-row v-for="(whereGroup, index) in whereGroups" :key="index">
          <v-col cols="12">
            <v-card color="primary" class="pa-2">
              <v-container fluid>
                <v-row v-for="(wherePart, index) in whereGroup.parts" :key="index">
                  <v-col cols="auto">
                    <v-select
                        class="pa-0"
                        color="accent"
                        item-color="accent"
                        v-model="wherePart.field"
                        :items="fields.split(',')"
                        :label="i18n('editor.field')"
                        required
                        append-icon="fa-chevron-down">
                    </v-select>
                  </v-col>

                  <v-col cols="auto">
                    <v-select
                        class="pa-0"
                        color="accent"
                        item-color="accent"
                        v-model="wherePart.operator"
                        :items="operators"
                        :label="i18n('editor.operation')"
                        required
                        append-icon="fa-chevron-down">
                    </v-select>
                  </v-col>

                  <v-col>
                    <v-text-field
                        class="pa-0"
                        color="accent"
                        v-model="wherePart.prop"
                        :label="i18n('editor.prop')"
                        :counter="50"
                        prepend-icon="fa-tag"
                        required>
                    </v-text-field>
                  </v-col>

                  <v-col v-if="index + 1 !== whereGroup.parts.length" cols="auto">
                    <v-btn v-if="wherePart.isAnd" @click="setPartIsAnd(wherePart)">{{ i18n('editor.and') }}</v-btn>
                    <v-btn v-else @click="setPartIsAnd(wherePart)">{{ i18n('editor.or') }}</v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-start">
                    <v-btn @click="addWherePart(whereGroup)">{{ i18n('editor.addWherePart') }}</v-btn>
                  </v-col>
                  <v-col class="text-end">
                    <v-btn @click="deleteGroup(whereGroup)" color="error">
                      <v-icon>fa-times</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>

          <v-col v-if="index + 1 !== whereGroups.length" cols="auto">
            <v-btn v-if="whereGroup.isAnd" @click="setGroupIsAnd(whereGroup)">{{ i18n('editor.and') }}</v-btn>
            <v-btn v-else @click="setGroupIsAnd(whereGroup)">{{ i18n('editor.or') }}</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <v-btn @click="addWhereGroup">{{ i18n('editor.addWhereGroup') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {QueryWhereGroup, QueryWherePart} from "@/plugins/types";

export default Vue.extend({
  name: 'QueryWhereBuilder',
  props: {
    fields: String,
  },
  data() {
    return {
      whereGroups: []
    }
  },
  computed: {
    operators(): string [] {
      return ['=', '>', '>=']
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    addWhereGroup(): void {
      (this.whereGroups as QueryWhereGroup []).push({parts: [], isAnd: true})
    },
    addWherePart(whereGroup: QueryWhereGroup): void {
      const newPart = {field: '', operator: '', prop: '', isAnd: true}
      whereGroup.parts.push(newPart)
    },
    setGroupIsAnd(whereGroup: QueryWhereGroup): void {
      whereGroup.isAnd = !whereGroup.isAnd
    },
    deleteGroup(whereGroup: QueryWhereGroup): void {
      this.whereGroups.forEach((group, index) => {
        if (group == whereGroup) {
          this.whereGroups.splice(index, 1)
        }
      })
    },
    setPartIsAnd(wherePart: QueryWherePart): void {
      wherePart.isAnd = !wherePart.isAnd
    }
  }
})
</script>

<style scoped>

</style>