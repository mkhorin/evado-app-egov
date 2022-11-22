'use strict';

Vue.component('comment-form', {
    extends: Vue.component('model-form'),
    props: {
        request: String
    },
    methods: {
        loadDefaultData () {
            return this.fetchJson('defaults', {
                class: this.metaClass,
                view: this.metaView,
                data: {
                    request: this.request
                }
            });
        }
    }
});