import Vue from "nativescript-vue";
import Home from "./components/Home";

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
TNSFontIcon.debug = false;
TNSFontIcon.paths = {
    'fa': './fonts/font-awesome.css',
    'ion': './fonts/ionicons.css',
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

// Vue.config.silent = false

new Vue({
    template: `
        <Frame>
            <Home />
        </Frame>`,
    components: {
        Home
    }
}).$start();
