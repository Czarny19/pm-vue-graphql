<template>
  <v-dialog persistent v-model="isOpen" max-width="400">
    <v-card v-if="loading" color="primary">
      <v-card-text>
        <v-progress-circular class="ml-auto mr-auto card-loading" indeterminate size="50"/>
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-title class="text-start">{{ i18n('user.loginSignUp') }}</v-card-title>
      <v-card-text class="text-start pt-6 pb-6">{{ i18n('user.loginInfo') }}</v-card-text>
      <v-card-actions class="pb-6 pl-6">
        <v-btn color="success" min-width="300" @click="login">
          {{ i18n('user.loginSignUp') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import {ADD_USER, GET_USER_BY_EMAIL} from "@/graphql/queries/user";
import {apolloClient} from "@/main";

export default Vue.extend({
  name: 'LoginDialog',
  data() {
    return {
      loading: false,
      email: ''
    }
  },
  computed: {
    isOpen(): boolean {
      return !this.$auth.isAuthenticated;
    }
  },
  methods: {
    async login(): Promise<void> {
      this.loading = true;
      await this.$auth.loginWithPopup();

      if (this.$auth.error) {
        this.loading = false;
        return;
      }

      if (this.$auth.isAuthenticated) {
        this.$auth.isAuthenticated = false;
        this.email = this.$auth.user.email;
        this.$apollo.queries.USER.skip = false;

        await this.$apollo.queries.USER.refetch();
        this.$auth.isAuthenticated = true;
      }
    },
    createUser(): void {
      this.$apollo.mutate({
        mutation: ADD_USER,
        variables: {
          email: this.email,
          username: this.email,
        }
      }).then((response) => {
        this.$emit('signup', response.data.insert_USER.returning[0].id);
      }).catch()
    }
  },
  apollo: {
    USER: {
      query: GET_USER_BY_EMAIL,
      variables(): { email: string } {
        return {
          email: this.email,
        }
      },
      result({data}): void {
        if (data.USER.length > 0) {
          apolloClient.cache.writeData({
            data: {
              currentUser: {
                __typename: 'User',
                id: data.USER[0].id,
                username: data.USER[0].username,
                email: data.USER[0].email
              }
            }
          });

          this.loading = false;

          return
        } else if (this.email) {
          this.loading = false;
          this.createUser();
        }
      }
    }
  }
})
</script>

<style scoped>

</style>