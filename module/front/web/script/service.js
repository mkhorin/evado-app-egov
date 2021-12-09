'use strict';

Vue.component('service', {
    props: {
        service: String
    },
    data () {
        return {
            id: null,
            name: null,
            brief: null,
            description: null,
            icon: null,
            request: null,
            formService: {
                id: this.service
            }
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onFillForm () {
            this.$root.$emit('request-form', this.service);
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'service',
                view: 'publicView',
                id: this.service
            });
            this.id = data._id;
            this.name = data.name;
            this.brief = data.brief;
            this.description = data.description;
            this.icon = this.getThumbnailUrl(data.icon);
            this.request = data.request;
        }
    },
    template: '#service'
});