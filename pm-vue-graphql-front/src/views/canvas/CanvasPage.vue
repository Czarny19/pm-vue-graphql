<template>
  <div>
    <CanvasTopBar :app="app"/>
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters>
        <v-col cols="2">
          <CanvasComponentBar/>
        </v-col>
        <v-col cols="8">
<!--          <DashboardCanvas :project-name="project.title"/>-->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CanvasTopBar from "@/views/canvas/components/CanvasTopBar";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID_QUERY} from "@/graphql/queries/project";
import CanvasComponentBar from "@/views/canvas/components/CanvasComponentBar";

export default {
  name: 'CanvasPage',
  components: {CanvasComponentBar, CanvasTopBar},
  data() {
    return {
      app: {}
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID_QUERY,
      variables() {
        return {
          id: this.$route.params.appId
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.app = data.PROJECT[0]
      },
    }
  }
}
</script>

<style scoped>

</style>