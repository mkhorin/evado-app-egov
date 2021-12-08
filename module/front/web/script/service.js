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
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        onFillForm () {
            this.$root.$emit('request-form', this.service);
        },
        async reload () {
            await this.load(this.service);
        },
        async load (id) {
            const data = await this.fetchJson('read', {
                class: 'service',
                view: 'publicView',
                id
            });
            this.$emit('load', data);
        },
        onLoad (data) {
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