<template>
  <div class="login__bg--fill">
    <LoadingDialog :dialog="loadingDialog" title="Wczytywanie..."/>

    <v-container class="login__bg--form">
      <v-row justify="center">
        <v-col xl="4" lg="6" md="8" sm="8" cols="12">
          <v-card class="pa-10 mt-12">
            <v-card-title>{{ $t('login.logInTitle') }}</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field v-model="username" :label="$t('login.username')" required/>
                <v-text-field v-model="password" :label="$t('login.password')" required type="password"/>

                <v-container fluid class="pa-0 pt-10">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-btn block large color="primary" :disabled="!valid" @click="submit">
                        {{ $t('login.logIn') }}
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="pt-4">
                      <v-btn block large color="secondary" @click="submitWithDemo">{{ $t('login.logInDemo') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {GET_USER_QUERY} from "@/graphql/user";
import LoadingDialog from "@/components/common/LoadingDialog";

export default {
  name: 'LoginPage',
  components: {LoadingDialog},
  data: () => ({
    valid: false,
    username: '',
    password: '',
    doLogin: false,
    loadingDialog: false
  }),
  methods: {
    submit() {
    },
    submitWithDemo() {
      this.username = 'demo@user.com'
      this.loadingDialog = true
      this.doLogin = true
    }
  },
  watch: {
    username() {
      this.valid = this.password.length && this.username.length
    },
    password() {
      this.valid = this.password.length && this.username.length
    }
  },
  apollo: {
    USER: {
      query: GET_USER_QUERY,
      variables() {
        return {
          email: this.username,
        }
      },
      skip() {
        return !this.doLogin
      },
      result({data}) {
        this.loadingDialog = false
        this.doLogin = false

        if (data.USER.length) {
          this.$router.push({name: 'Projects'})
        }
      },
    }
  }
}
</script>

<style scoped>

</style>