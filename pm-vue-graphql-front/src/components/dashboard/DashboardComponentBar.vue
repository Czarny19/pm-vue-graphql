<template>
  <div class="side-bar__container--wrapper">
    <div>Komponenty</div>
    <div>
      <v-container>
        <v-row no-gutters>
          <template v-for="(component) in components">
            <v-col cols="12" sm="12" md="12" lg="6" xl="6" :key="component.id">
              <v-card class="ma-4">
                <v-card-title>
                  <v-icon class="ma-auto">{{component.icon}}</v-icon>
                </v-card-title>
                <v-card-text>
                  {{component.title}}
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardComponentBar",
  computed: {
    components() {
      return [
        {id: 'container', title: 'Container', icon: 'fa-chalkboard'},
        {id: 'row', title: 'Row', icon: 'fa-chalkboard'},
        {id: 'column', title: 'Column', icon: 'fa-chalkboard'},
        {id: 'button', title: 'Button', icon: 'fa-archive'}
      ]
    }
  }
}
</script>

<style scoped>

</style>