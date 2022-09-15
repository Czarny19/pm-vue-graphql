<template>
  <v-card-text>
    <v-text-field
        class="pl-2 pr-2"
        color="accent"
        v-model="projectData.name"
        :label="i18n('project.name')"
        :counter="30"
        :rules="nameRules"
        prepend-icon="fa-tag"
        required
    />

    <v-textarea
        class="pl-2 pr-2"
        color="accent"
        v-model="projectData.description"
        :label="i18n('project.description')"
        :rules="descriptionRules"
        :counter="160"
        prepend-icon="fa-pen"
        required
        auto-grow
        rows="1"
    />

    <v-select
        class="pl-2 pr-2"
        color="accent"
        item-color="accent"
        v-model="projectData.theme_id"
        :items="['', ...themes]"
        :label="i18n('project.theme')"
        :rules="themeRules"
        required
        append-icon="fa-chevron-down"
        prepend-icon="fa-palette"
        item-text="name"
        item-value="id"
    >
      <template v-slot:append-outer>
        <v-icon class="pl-2 pr-2" @click="clearTheme">fa-times</v-icon>
      </template>
    </v-select>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ProjectFormBasicInfo',
  props: {
    project: Object,
    themes: Array
  },
  data() {
    return {
      projectData: {},
      nameRules: [
        (v: string) => !!v || this.$t('project.nameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('project.nameTooLong'),
      ],
      descriptionRules: [
        (v: string) => !!v || this.$t('project.descriptionRequired'),
        (v: string) => (v && v.length <= 200) || this.$t('project.descriptionTooLong'),
      ],
      themeRules: [
        (v: string) => !!v || this.$t('project.themeRequired'),
      ]
    }
  },
  methods: {
    clearTheme(): void {
      this.$emit('cleartheme');
    }
  },
  watch: {
    project: {
      handler() {
        this.projectData = this.project;
      },
      deep: true
    }
  },
  beforeMount() {
    this.projectData = this.project;
  }
})
</script>

<style scoped>

</style>