'use strict';

Vue.component('model-form-file-item', {
    props: {
        metaClass: String
    },
    data () {
        return {
            error: null,
            hint: null
        };
    },
    created () {
    },
    methods: {
        onChange (event) {
            this.file = event.currentTarget.files[0];
            if (this.file) {
                this.upload();
            }
        },
        async onRemove () {
            if (this.loading) {
                await Jam.dialog.confirm('The uploading is in progress. Delete it anyway?');
            } else if (this.id) {
                await Jam.dialog.confirm('The file is uploaded. Delete it anyway?');
            }
            this.$emit('remove');
        },
        async upload () {
            try {
                this.hint = Jam.t('File is uploading...');
                const file = this.file;
                const {id} = await this.fetchFile(this.metaClass, file);
                this.id = await this.create(id, file.name);
                this.hint = Jam.t('File uploaded');
            } catch (err) {
                this.error = err;
                this.hint = '';
            }
        },
        create (file, name) {
            return this.fetchText('create', {
                class: this.metaClass,
                data: {file, name}
            });
        }
    },
    template: '#model-form-file-item'
});