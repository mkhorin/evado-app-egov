/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.FormAttr = class FormAttr extends Front.Element {

    init () {
        this.$value = this.find('[name]');
    }
};

Front.FormBoolean = class FormBoolean extends Front.FormAttr {

    init () {
        super.init();
        this.$checkbox = this.find('[type="checkbox"]');
        this.$checkbox.prop('checked', this.$value.val() === 'true');
        this.$checkbox.change(this.onChangeCheckbox.bind(this));
    }

    onChangeCheckbox () {
        this.$value.val(this.$checkbox.is(':checked'));
    }
};

Front.FormDate = class FormDate extends Front.FormAttr {

    init () {
        super.init();
        const options = {};
        options.defaultDate = this.getDefaultDate(this.$value.val());
        options.format = Jam.DateHelper.getMomentFormat('date');
        this.$picker = this.find('.datepicker');
        this.$picker.datetimepicker({...$.fn.datetimepicker.defaultOptions, ...options});
        this.picker = this.$picker.data('DateTimePicker');
        this.$picker.on('dp.change', this.onChangeDate.bind(this));
    }

    getDefaultDate (value) {
        return !value ? null : this.utc ? new Date(value.slice(0, -1)) : new Date(value);
    }

    onChangeDate (event) {
        const date = event.date;
        const format = this.picker.options().format;
        const value = date ? moment(moment(date).format(format), format) : '';
        this.$value.val(value ? Jam.DateHelper.stringify(value, this.utc) : '');
        if (!date) {
            this.picker.hide();
        }
    }
};

Front.FormSelect = class FormSelect extends Front.Element {
};