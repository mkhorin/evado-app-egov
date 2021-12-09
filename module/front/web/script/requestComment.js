'use strict';

Vue.component('request-comment', {
    props: {
        comment: String,
        request: String,
        requestClass: String,
        service: String
    },
    methods: {
        onRequest () {
            this.$root.$emit('request-view', {
                request: this.request,
                requestClass: this.requestClass,
                service: this.service
            });
        },
    },
    template: '#request-comment'
});