'use strict';

Vue.component('request-comments', {
    props: {
        commentCreation: Boolean,
        request: String,
        requestClass: String,
        service: String,
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
        onComment (id) {
            this.$root.$emit('request-comment', {
                comment: id,
                request: this.request,
                requestClass: this.requestClass,
                service: this.service
            });
        },
        onNew () {
            this.$refs.newComment.show();
            this.$refs.newCommentForm?.reset();
        },
        onSend () {
            const form = this.$refs.newCommentForm;
            if (form.validate()) {
                this.send(form.serialize());
            }
        },
        async send (data) {
            try {
                data = {
                    request: this.request,
                    ...data
                };
                await this.fetchText('create', {
                    class: 'comment',
                    data
                });
                this.$refs.newComment.hide();
                await this.reload();
            } catch (err) {
                this.showError(err);
            }
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'comment',
                view: 'listByRequest',
                length: this.pageSize,
                start: page * this.pageSize,
                filter: this.getFilter()
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            return [{
                attr: 'request',
                op: 'equal',
                value: this.request
            }];
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                date: Jam.FormatHelper.asDatetime(item._createdAt),
                sender: this.getValueTitle('_creator', item),
                message: item.message
            }));
        }
    },
    template: '#request-comments'
});