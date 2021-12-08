'use strict';

Vue.component('model-form-date', {
    extends: Vue.component('model-form-attr'),
    created () {
        if (this.readOnly) {
            this.value = this.formatDate();
        }
    },
    mounted () {
        if (!this.readOnly) {
            this.createPicker();
        }
    },
    methods: {
        formatDate () {
            switch (this.viewType) {
                case 'datetime':
                case 'localDatetime':
                    return Jam.FormatHelper.asDatetime(this.value);
            }
            return Jam.FormatHelper.asDate(this.value);
        },
        createPicker () {
            const options = {
                defaultDate: this.getDefaultDate(this.value),
                format: Jam.DateHelper.getMomentFormat('date')
            };
            this.$picker = $(this.$el.querySelector('.datepicker'));
            this.$picker.datetimepicker({...$.fn.datetimepicker.defaultOptions, ...options});
            this.$picker.on('dp.change', this.onChangePickerDate.bind(this));
            this.picker = this.$picker.data('DateTimePicker');
        },
        getDefaultDate (value) {
            return !value ? null : this.utc ? new Date(value.slice(0, -1)) : new Date(value);
        },
        onChangePickerDate ({date}) {
            const format = this.picker.options().format;
            const value = date ? moment(moment(date).format(format), format) : '';
            this.value = value ? Jam.DateHelper.stringify(value, this.utc) : '';
            if (!date) {
                this.picker.hide();
            }
        }
    },
    template: '#model-form-date'
});