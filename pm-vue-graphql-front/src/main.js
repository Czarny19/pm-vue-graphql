import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import VModal from 'vue-js-modal/dist/index.nocss'
import router from './router'
import {messages} from './i18n'
import vuetify from './plugins/vuetify'

import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

document.title = 'PM Vue-Graphql Demo'

Vue.config.productionTip = false

const getHeaders = () => {
    const headers = {}
    const token = window.localStorage.getItem('apollo-token')
    if (token) headers.authorization = `Bearer ${token}`
    return headers
};

const link = new HttpLink({uri: 'https://magister-app.herokuapp.com/v1/graphql', fetch, headers: getHeaders()})
const client = new ApolloClient({link: link, cache: new InMemoryCache({addTypename: true})})
const apolloProvider = new VueApollo({defaultClient: client})

Vue.use(VueI18n)
Vue.use(VModal)
Vue.use(VueApollo)

export const i18n = new VueI18n({locale: 'pl', messages})

new Vue({router, apolloProvider, i18n, vuetify, render: h => h(App)}).$mount('#app')
