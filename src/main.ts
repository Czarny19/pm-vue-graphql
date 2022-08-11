import Vue from "vue";
import App from "./App.vue";
import VueI18n from "vue-i18n";
import VModal from "vue-js-modal";
import router from "./router/index"
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import {defaultLocale, messages} from "@/i18n";
import {HttpLink} from "apollo-link-http";
import {persistCache} from "apollo-cache-persist";
import {InMemoryCache, NormalizedCacheObject} from "apollo-cache-inmemory";
import {PersistedData, PersistentStorage} from "apollo-cache-persist/types";
import {typeDefs} from "./graphql/typedefs";
import {auth0CientId, auth0Domain, auth0OnRedirectCallback} from "./plugins/auth_config";
import {Auth0} from "./plugins/auth0";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";

document.title = 'PM Vue-Graphql Demo'
Vue.config.productionTip = false

const apolloLink = new HttpLink({
    uri: 'https://magister-app.herokuapp.com/v1/graphql', fetch, headers: () => {
        const headers = {authorization: ''}
        const token = window.localStorage.getItem('apollo-token')
        if (token) headers.authorization = `Bearer ${token}`
        return headers
    }
})

const apolloCache = new InMemoryCache({addTypename: false})
const apolloStorage = window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>

export const apolloClient = new ApolloClient({
    typeDefs: typeDefs,
    link: apolloLink,
    cache: apolloCache,
    resolvers: {}
})

const apolloProvider = new VueApollo({defaultClient: apolloClient})

persistCache({cache: apolloCache, storage: apolloStorage}).then()

Vue.use(VueI18n)
Vue.use(VModal)
Vue.use(VueApollo)
Vue.use(VueCookies)
Vue.use(Auth0, {domain: auth0Domain, clientId: auth0CientId, onRedirectCallback: auth0OnRedirectCallback});

export const i18n = new VueI18n({locale: defaultLocale, messages, fallbackLocale: defaultLocale})
export const cryptoKey = 'jXn2r5u8x/A?D(G+KbPeShVkYp3s6v9y'

Vue.mixin({
    methods: {
        i18n(key: string): string {
            return this.$t(key).toString()
        }
    }
})

new Vue({router, apolloProvider, i18n, vuetify, render: h => h(App)}).$mount('#app')