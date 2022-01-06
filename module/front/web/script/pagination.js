'use strict';

Vue.component('pagination', {
    data () {
        return {
            numPages: 0,
            pages: [],
            page: 0
        };
    },
    computed: {
        visible () {
            return this.numPages > 1;
        }
    },
    async created () {
        this.$parent.$on('load', this.onLoadList);
    },
    methods: {
        onLoadList ({pageSize, totalSize, page}) {
            this.numPages = Math.ceil(totalSize / pageSize);
            this.page = page;
            this.pages = this.formatPages();
        },
        formatPages () {
            const result = [];
            for (let i = 0; i < this.numPages; ++i) {
                result.push({
                    active: i === this.page,
                    page: i,
                    text: i + 1
                });
            }
            return result;
        },
        onPage (page) {
            this.loadPage(Number(page));
        },
        onFirst () {
            this.loadPage(0);
        },
        onPrev () {
            this.loadPage(this.page - 1);
        },
        onNext () {
            this.loadPage(this.page + 1);
        },
        onLast () {
            this.loadPage(this.numPages - 1);
        },
        loadPage (page) {
            if (page >= this.numPages) {
                page = this.numPages - 1;
            }
            if (page < 0) {
                page = 0;
            }
            if (page !== this.page) {
                this.$emit('change', page);
            }
        }
    },
    template: '#pagination'
});