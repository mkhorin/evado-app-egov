'use strict';

Vue.component('request-form', {
    props: {
        service: String
    },
    data () {
        return {
            id: null,
            title: null,
            draftRequest: false,
            request: null,
            requestId: null,
            changed: false
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        getForm () {
            return this.$refs.form;
        },
        onService (id) {
            this.$root.$emit('service', id);
        },
        onSave () {
            this.save();
        },
        async save () {
            try {
                this.changed = false;
                const action = this.requestId ? 'update' : 'create';
                const data = this.getForm().serialize();
                this.requestId = await this.fetchText(action, {
                    class: this.request,
                    id: this.requestId,
                    data
                });
            } catch (err) {
                this.showError(err);
            }
        },
        onSubmit () {
            if (this.getForm().validate()) {
                this.submit();
            }
        },
        async submit () {
            if (this.changed) {
                await this.save();
            }
            try {
                await this.fetchText('transit', {
                    class: this.request,
                    id: this.requestId,
                    transition: 'submit'
                });
                this.toAccount();
            } catch (err) {
                this.showError(err);
            }
        },
        async load () {
            await this.loadService();
            await this.loadLastRequest();
            if (!this.draftRequest) {
                this.$root.$emit('request-view', {
                    requestClass: this.request,
                    request: this.requestId,
                    service: this.service
                });
            }
        },
        async loadService () {
            const data = await this.fetchJson('read', {
                class: 'service',
                view: 'publicView',
                id: this.service
            });
            this.id = data._id;
            this.title = data.name;
            this.request = data.request;
        },
        async loadLastRequest () {
            const data = await this.fetchJson('list', {
                class: this.request,
                view: 'listByUser',
                filter: [{
                    attr: '_state',
                    op: 'equal',
                    value: 'draft'
                }, {
                    or: true,
                    attr: '_state',
                    op: 'equal',
                    value: 'pending'
                }]
            });
            const items = data?.items;
            const item = items?.[0];
            this.draftRequest = !items.length || item._state === 'draft';
            this.requestId = item?._id;
        },
        onChangeForm () {
            this.changed = true;
        }
    },
    template: '#request-form'
});