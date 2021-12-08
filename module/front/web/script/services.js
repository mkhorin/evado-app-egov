'use strict';

Vue.component('services', {
    props: {
        pageSize: {
            type: Number,
            default: 4
        }
    },
    data () {
        return {
            items: [],
            searchText: null
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
        onService (id) {
            this.$root.$emit('service', id);
        },
        onSearch (text) {
            this.searchText = text;
            this.reload();
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'service',
                view: 'publicList',
                filter:  this.getFilter(),
                length: this.pageSize,
                start: page * this.pageSize
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            if (this.searchText) {
                return [{
                    attr: 'name',
                    op: 'contains',
                    value: this.searchText
                }];
            }
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                name: item.name,
                icon: this.getThumbnailUrl(item.icon)
            }));
        },
    },
    template: '#services'
});