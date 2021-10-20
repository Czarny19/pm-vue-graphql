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
                accent: '#4e1c3f',
                error: '#f44336',
                warning: '#ff5722',
                info: '#006e9f',
                success: '#409044'
            }
        },
    },
})