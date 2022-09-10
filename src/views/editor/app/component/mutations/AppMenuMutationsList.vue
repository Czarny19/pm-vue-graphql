<template>
  <div>
    <v-card color="secondary" v-for="mutation in mutations" :key="mutation.id" class="mt-3">
      <v-container fluid class="pl-6 pr-6">
        <v-row no-gutters>
          <v-col class="text-start ma-auto text-body-1">
            {{ mutation.name }}
          </v-col>

          <v-col class="text-end">
            <span class="text-body-1 text--secondary pr-10">{{ mutation.type }}</span>
            <span class="text-body-2 text--secondary pr-6">
              {{ i18n('editor.modifyDate') }}: {{ mutation.modify_date }}
            </span>

            <IconButton
                :label="i18n('common.edit')"
                icon="fa-edit"
                color="info"
                @click="openMutation(mutation.id)"
            />

            <IconButton
                class="ml-6"
                :label="i18n('common.delete')"
                icon="fa-trash-can"
                color="error"
                @click="deleteMutationClicked(mutation.id)"
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
  name: 'AppMenuMutationsList',
  components: {IconButton},
  props: {
    datasourceId: Number,
    mutations: Array
  },
  methods: {
    openMutation(id: number): void {
      this.$router.push({
        name: 'Mutation', params: {datasourceId: this.datasourceId.toString(), mutationId: id.toString()}
      });
    },
    deleteMutationClicked(id: number): void {
      this.$emit('delete', id);
    }
  }
})
</script>

<style scoped>

</style>