'use strict';

Vue.component('request-view', {
    props: {
        request: String,
        requestClass: String,
        service: String
    },
    data () {
        return {
            item: null,
            icon: null,
            state: null,
            stateTitle: null,
            serviceName: null
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onService (id) {
            this.$root.$emit('service', id);
        },
        async load () {
            await this.loadService();
            await this.loadRequest();
        },
        async loadService () {
            const data = await this.fetchJson('read', {
                class: 'service',
                view: 'publicView',
                id: this.service
            });
            this.icon = this.getThumbnailUrl(data.icon);
            this.serviceName = data.name;
        },
        async loadRequest () {
            const data = await this.fetchJson('read', {
                class: this.requestClass,
                id: this.request
            });
            this.state = data._state;
            this.stateTitle = this.getValueTitle('_state', data);
        }
    },
    template: '#request-view'
});