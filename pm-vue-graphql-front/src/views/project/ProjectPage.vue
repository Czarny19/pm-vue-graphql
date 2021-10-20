<template>
  <v-container class="ml-2 mr-2">
    <LoadingDialog :dialog="loadingDialog" :title="$t('app.saving')"/>

    <v-row>
      <v-col cols="12" sm="12" md="10" lg="8" xl="8">
        <v-card class="ma-4" color="accent">
          <v-card-title>
            {{ $t('app.newApp') }}
          </v-card-title>
          <div class="pb-2 pr-2 pl-2">
            <v-card>
              <v-card-text>
                <v-form v-model="valid" ref="form" @submit.prevent="submit">
                  <v-text-field v-model="name" :label="$t('app.name')" required :counter="30" :rules="nameRules"/>
                  <v-textarea
                      v-model="description"
                      :label="$t('app.description')"
                      :rules="descriptionRules"
                      :counter="200"
                      required
                      auto-grow
                      rows="1"
                  >
                  </v-textarea>

                  <v-container fluid class="pa-0 pt-10">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-btn block large color="primary" @click="submit">
                          {{ $t('app.create') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {ADD_PROJECT_FOR_USER} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";
import LoadingDialog from "@/components/LoadingDialog";

export default {
  name: 'ProjectPage',
  components: {LoadingDialog},
  data() {
    return {
      name: '',
      description: '',
      valid: false,
      loadingDialog: false,
      nameRules: [
        v => !!v || this.$t('app.nameRequired'),
        v => (v && v.length <= 30) || this.$t('app.nameTooLong'),
      ],
      descriptionRules: [
        v => !!v || this.$t('app.descriptionRequired'),
        v => (v && v.length <= 200) || this.$t('app.descriptionTooLong'),
      ],
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate()

      if (this.valid) {
        this.loadingDialog = true

        this.$apollo.mutate({
          mutation: ADD_PROJECT_FOR_USER,
          variables: {
            user_id: this.currentUser[0].id,
            name: this.name,
            description: this.description
          }
        }).then(() => {
          this.loadingDialog = false
          this.$router.back()
        }).catch(() => {
          this.loadingDialog = false
        })
      }
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
  },
}
</script>

<style scoped>

</style>