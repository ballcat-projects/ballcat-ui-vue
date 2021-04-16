import Vue from 'vue'
import VueStorage from 'vue-ls'
import { storageOptions } from '@/config/projectConfig'

// base library
import '@/core/lazy_lib/components_use'
import Viser from 'viser-vue'

// ext library
import VueClipboard from 'vue-clipboard2'
import './directives/action'

VueClipboard.config.autoSetContainer = true

Vue.use(Viser)

Vue.use(VueStorage, storageOptions)
Vue.use(VueClipboard)
