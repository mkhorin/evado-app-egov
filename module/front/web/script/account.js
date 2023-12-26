'use strict';

Vue.component('account', {
    props: {
        pageSize: {
            type: Number,
            default: 5
        }
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        onRequest ({state, id, service, className}) {
            if (state === 'draft') {
                return this.$root.$emit('request-form', service?._id);
            }
            this.$root.$emit('request-view', {
                request: id,
                requestClass: className,
                service: service?._id
            });
        },
        onService (id) {
            this.$root.$emit('service', id);
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const {pageSize} = this;
            const data = await this.fetchJson('list', {
                class: 'request',
                view: 'listByUser',
                length: pageSize,
                start: page * pageSize
            });
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                className: item._class,
                name: item.name,
                icon: this.getThumbnailUrl(item.icon),
                service: item.service,
                state: item._state,
                stateTitle: this.getValueTitle('_state', item)
            }));
        },
    },
    template: '#account'
});