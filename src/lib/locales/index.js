import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import en from './en'

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: en
  }
})

export default i18n
