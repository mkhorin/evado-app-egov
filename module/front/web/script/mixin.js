'use strict';

Vue.mixin({
    data () {
        return {
            loading: false
        };
    },
    mounted () {
        this.translateElement();
    },
    updated () {
        this.translateElement();
    },
    methods: {
        isGuest () {
            return !this.$root.userId;
        },
        getDataUrl (action) {
            return `${this.$root.dataUrl}/${action}`;
        },
        getMetaUrl (action) {
            return `${this.$root.metaUrl}/${action}`;
        },
        getDownloadUrl (metaClass, id) {
            return `${this.getFileUrl('download', metaClass)}&id=${id}`;
        },
        getUploadUrl (metaClass) {
            return this.getFileUrl('upload', metaClass);
        },
        getFileUrl (action, metaClass) {
            return `${this.$root.fileUrl}/${action}?c=${metaClass}`;
        },
        getThumbnailUrl (id, size = '') {
            return id ? `${this.$root.thumbnailUrl}&s=${size}&id=${id}` : null;
        },
        getRandomId () {
            return `${Date.now()}${Jam.Helper.random(10000, 99999)}`;
        },
        getRefArray (name) {
            const data = this.$refs[name];
            return Array.isArray(data) ? data : data ? [data] : [];
        },
        getValueTitle (key, data) {
            const item = data[key];
            if (item?.hasOwnProperty('_title')) {
                return item._title;
            }
            return data.hasOwnProperty(`${key}_title`) ? data[`${key}_title`] : item;
        },
        fetchJson (action, ...args) {
            return this.fetchByMethod('getJson', this.getDataUrl(action), ...args);
        },
        fetchMeta (action, ...args) {
            return this.fetchByMethod('getJson', this.getMetaUrl(action), ...args);
        },
        fetchText (action, ...args) {
            return this.fetchByMethod('getText', this.getDataUrl(action), ...args);
        },
        fetchFile (metaClass, file, options) {
            const headers = {};
            const body = new FormData;
            body.append('file', file.name);
            body.append('file', file);
            return this.fetchByMethod('getJson', this.getUploadUrl(metaClass), null, {headers, body, ...options});
        },
        fetchByMethod (name, url, data, options) {
            try {
                this.loading = true;
                const csrf = this.$root.csrf;
                return (new Jam.Fetch)[name](url, {csrf, ...data}, options);
            } finally {
                this.loading = false;
            }
        },
        requireAuth () {
            if (this.isGuest()) {
                location.assign(this.$root.authUrl);
                return false;
            }
            return true;
        },
        toServices () {
            this.$root.$emit('services');
        },
        toAccount () {
            this.$root.$emit('account');
        },
        translateElement () {
            Jam.i18n.translate($(this.$el));
        },
        showError () {
            Jam.dialog.error(...arguments);
        }
    }
});