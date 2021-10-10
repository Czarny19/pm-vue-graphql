import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#513939',
                secondary: '#3f2d2d',
                accent: '#343333',
                error: '#f44336',
                warning: '#ff5722',
                info: '#03a9f4',
                success: '#4caf50'
            }
        },
    },
})