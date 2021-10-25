import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#484848',
                secondary: '#676262',
                accent: '#572858',
                error: '#F44336',
                warning: '#FF5722',
                info: '#006E9F',
                success: '#409044'
            }
        },
    },
})