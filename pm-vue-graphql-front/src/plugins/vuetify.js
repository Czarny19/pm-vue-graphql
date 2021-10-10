import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#7c3d3d',
                secondary: '#f84848',
                accent: '#c71363',
                error: '#f44336',
                warning: '#ff5722',
                info: '#03a9f4',
                success: '#4caf50'
            }
        },
    },
})