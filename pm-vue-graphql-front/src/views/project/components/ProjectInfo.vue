<template>
  <v-card class="ma-4 pa-8">
    <v-card-title>
      <v-icon class="ma-auto" size="100">fa-tablet</v-icon>
    </v-card-title>
    <v-card-text class="text-h5 mt-4">
      {{ $t('project.configInfo') }}
    </v-card-text>
    <v-card-subtitle class="text-left">
      <v-container class="pa-0">
        <v-row>
          <v-col cols="auto" class="ma-auto">
            <v-icon>fa-pencil-ruler</v-icon>
          </v-col>
          <v-col>
            <div v-html="$t('project.themeInfo')"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="ma-auto">
            <v-icon>fa-database</v-icon>
          </v-col>
          <v-col>
            <div v-html="$t('project.dbInfo')"/>
          </v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: 'ProjectInfo'
}
</script>

<style scoped>

</style>