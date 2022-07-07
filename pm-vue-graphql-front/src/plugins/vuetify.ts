import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#212121',
                secondary: '#2F2533',
                accent: '#F6EEFF',
                error: '#F44336',
                warning: '#FF5722',
                info: '#006E9F',
                success: '#409044'
            }
        },
    },
})