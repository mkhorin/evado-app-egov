'use strict';

Vue.component('model-form-file', {
    extends: Vue.component('model-form-attr'),
    data () {
        return {
            items: []
        };
    },
    created () {
        this.normalizeValue();
    },
    methods: {
        onAdd () {
            this.items.push({
                key: this.getRandomId()
            });
        },
        onRemove (item) {
            this.items.splice(this.items.indexOf(item), 1);
        },
        normalizeValue () {
            const items = Array.isArray(this.value) ? this.value : this.value ? [this.value] : [];
            for (const item of items) {
                this.normalizeValueItem(item);
            }
        },
        normalizeValueItem (item) {
            item.url = this.getDownloadUrl(this.refClass, item._id);
            item.size = Jam.FormatHelper.asBytes(item._size);
        },
        clearValue () {
            this.items = [];
        },
        serialize () {
            const links = [];
            for (const ref of this.getRefArray('item')) {
                if (ref.id) {
                    links.push(ref.id);
                }
            }
            return links.length ? {links} : null;
        }
    },
    template: '#model-form-file'
});