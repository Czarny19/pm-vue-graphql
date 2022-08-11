<template>
  <v-dialog persistent v-model="isOpen" max-width="800">
    <v-card v-if="loading" color="primary">
      <v-card-text>
        <v-progress-circular class="ml-auto mr-auto card-loading" indeterminate size="50"/>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-title class="text-start">{{ i18n('user.accountDetails') }}</v-card-title>

      <v-card-text class="text-start pt-2 pb-6">
        <div class="pa-2">
          <v-icon color="success" large class="pr-6">fa-check</v-icon>
          {{ i18n('user.accountCreatedInfo') }}
        </div>

        <v-divider class="mt-2 mb-2"></v-divider>

        <v-form v-model="valid" ref="form" @submit.prevent="save">
          <v-text-field
              class="pl-2 pr-2"
              color="accent"
              v-model="userEmail"
              :label="i18n('user.email')"
              prepend-icon="fa-envelope"
              readonly>
          </v-text-field>

          <v-textarea
              class="pl-2 pr-2"
              color="accent"
              v-model="userUsername"
              :label="i18n('user.username')"
              :rules="usernameRules"
              :counter="60"
              prepend-icon="fa-user"
              required
              auto-grow
              rows="1">
          </v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <IconButton :label="i18n('common.save')" icon="fa-save" color="success" @click="save"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {GET_USER_BY_ID, UPDATE_USER_USERNAME} from "@/graphql/queries/user";
import {apolloClient} from "@/main";

export default Vue.extend({
  name: 'SignUpDialog',
  components: {IconButton},
  props: {
    dialog: Boolean,
    userId: Number
  },
  data() {
    return {
      loading: false,
      isOpen: false,
      valid: false,
      userEmail: '',
      userUsername: '',
      usernameRules: [
        (v: string) => !!v || this.$t('user.usernameRequired'),
        (v: string) => (v && v.length <= 60) || this.$t('user.usernameTooLong'),
      ],
    }
  },
  watch: {
    dialog(): void {
      this.isOpen = this.dialog
    }
  },
  methods: {
    save(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.loading = true
        this.updateUsername()
      }
    },
    updateUsername(): void {
      if (this.$auth.isAuthenticated) {
        this.$auth.isAuthenticated = false
      }

      this.$apollo.mutate({
        mutation: UPDATE_USER_USERNAME,
        variables: {
          id: this.userId,
          username: this.userUsername,
        }
      }).then(async () => {
        this.$apollo.queries.USER.skip = false
        await this.$apollo.queries.USER.refetch()
        this.$auth.isAuthenticated = true

        this.loading = false
        this.isOpen = false
      }).catch(() => {
        this.loading = false
        this.isOpen = false
      })
    }
  },
  apollo: {
    USER: {
      query: GET_USER_BY_ID,
      variables(): { userId: number } {
        return {
          userId: this.userId,
        }
      },
      skip(): boolean {
        return this.userId < 0
      },
      result({data}): void {
        if (data.USER.length > 0) {
          apolloClient.cache.writeData({
            data: {
              currentUser: {
                __typename: 'User',
                id: data.USER[0].id,
                username: data.USER[0].username,
                email: data.USER[0].email,
              },
            },
          })

          this.userEmail = data.USER[0].email
          this.userUsername = data.USER[0].email.toString().substring(0, 59)
          this.loading = false
          return
        }

        this.$router.go()
      }
    }
  }
})
</script>

<style scoped>

</style>