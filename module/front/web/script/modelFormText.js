'use strict';

Vue.component('model-form-text', {
    extends: Vue.component('model-form-attr'),
    data () {
        return {
            rows: 4
        };
    },
    template: '#model-form-text'
});