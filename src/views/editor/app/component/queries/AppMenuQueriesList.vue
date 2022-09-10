<template>
  <div>
    <v-card color="secondary" v-for="query in queries" :key="query.id" class="mt-3">
      <v-container fluid class="pl-6 pr-6">
        <v-row no-gutters>
          <v-col class="text-start ma-auto text-body-1">
            {{ query.name }}
          </v-col>

          <v-col class="text-end">
            <span class="text-body-2 text--secondary pr-6">
              {{ i18n('editor.modifyDate') }}: {{ query.modify_date }}
            </span>
            <IconButton
                :label="i18n('common.edit')"
                icon="fa-edit"
                color="info"
                @click="openQuery(query.id)"
            />

            <IconButton
                class="ml-6"
                :label="i18n('common.delete')"
                icon="fa-trash-can"
                color="error"
                @click="deleteQueryClicked(query.id)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'AppMenuQueriesList',
  components: {IconButton},
  props: {
    datasourceId: Number,
    queries: Array
  },
  methods: {
    openQuery(id: number): void {
      this.$router.push({name: 'Query', params: {datasourceId: this.datasourceId.toString(), queryId: id.toString()}});
    },
    deleteQueryClicked(id: number): void {
      this.$emit('delete', id);
    }
  }
})
</script>

<style scoped>

</style>