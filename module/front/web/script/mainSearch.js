'use strict';

Vue.component('main-search', {
    data () {
        return {
            text: ''
        };
    },
    methods: {
        onInput () {
            if (!this.text) {
                this.onSubmit();
            }
        },
        onSubmit () {
            this.$emit('search', this.text);
        }
    },
    template: '#main-search'
});