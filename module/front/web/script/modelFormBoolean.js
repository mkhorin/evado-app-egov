'use strict';

Vue.component('model-form-boolean', {
    extends: Vue.component('model-form-attr'),
    methods: {
        onCheck () {
            this.setValue(!this.value);
        },
        setValue (value) {
            this.value = value;
        }
    },
    template: '#model-form-boolean'
});