import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
    iconfont: 'fa',
    theme: {
      themes: {
        light: {
          primary: '#2d4052',
          accent: '#1abc9c',
          gold: '#dea600',
          error: '#CE796B'
        }
      }
    }
  })
  
