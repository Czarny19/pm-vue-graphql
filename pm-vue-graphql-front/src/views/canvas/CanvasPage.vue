<template>
  <div class="canvas__container--wrapper">
    <CanvasTopBar :project="project"/>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="2">
          <CanvasWidgets/>
        </v-col>
        <v-col cols="8">
          <CanvasDisplay :current-page="currentPage" @setActive="setActive"/>
        </v-col>
        <v-col cols="2">
          <CanvasProperties :widget="activeWidget"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CanvasTopBar from "@/views/canvas/components/CanvasTopBar";
import CanvasWidgets from "@/views/canvas/components/CanvasWidgets";
import CanvasDisplay from "@/views/canvas/components/CanvasDisplay";
import CanvasProperties from "@/views/canvas/components/CanvasProperties";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";

export default {
  name: 'CanvasPage',
  components: {CanvasProperties, CanvasDisplay, CanvasWidgets, CanvasTopBar},
  data() {
    return {
      project: {},
      activeWidget: null
    }
  },
  computed: {
    currentPage() {
      return {
        id: 'el0',
        title: 'Page',
        children: []
      }
    }
  },
  methods: {
    setActive(widget) {
      this.activeWidget = widget
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      variables() {
        return {
          id: this.$route.params.projectId
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.project = data.PROJECT[0]
      },
    }
  }
}
</script>

<style scoped>

</style>