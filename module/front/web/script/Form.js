'use strict';

Front.Form = class Form extends Front.Element {

    init () {
        this.$topError = this.find('.form-error');
        this.on('form:clear', this.onClear.bind(this));
        this.on('click', '.nav-tab a', this.onClickTab.bind(this));
        this.on('click', '.form-set-toggle', this.onClickGroup.bind(this));
    }

    onClear () {
        this.find('[name]').val('');
    }

    onClickTab (event) {
        event.preventDefault();
        const $nav = $(event.currentTarget).parent();
        const $content = $nav.closest('.tabs').children('.tab-content');
        $nav.parent().children('.active').removeClass('active');
        $content.children('.active').removeClass('active');
        $nav.addClass('active');
        $content.children(`[data-id="${$nav.data('id')}"]`).addClass('active');
    }

    onClickGroup (event) {
        const $group = $(event.currentTarget).closest('.form-set').toggleClass('active');
    }

    getAttr (name) {
        return this.getAttrByElement(this.getValueElement(name));
    }

    getAttrByElement (element) {
        return this.find(element).closest('.form-attr');
    }

    getValue (name) {
        return this.getValueElement().val();
    }

    getValueElement (name) {
        return this.find(`[name="${name}"]`);
    }

    hasError () {
        return this.find('.has-error').length > 0;
    }

    addTopError (message) {
        this.$topError.html(message).addClass('has-error');
    }

    addErrors (data) {
        if (!data) {
            return falae;
        }
        const topErrors = [];
        for (const name of Object.keys(data)) {
            this.getAttr(name).length
                ? this.addError(name, data[name])
                : topErrors.push(data[name]);
        }
        if (topErrors.length) {
            this.addTopError(topErrors.join('<br>'));
        }
    }

    addError (name, message) {
        const $attr = this.getAttr(name);
        $attr.addClass('has-error').find('.error-block').html(message);
        $attr.parents('.form-set').addClass('has-group-error');
    }

    clearErrors () {
        this.find('.has-error').removeClass('has-error');
        this.find('.has-group-error').removeClass('has-group-error');
    }

    serialize () {
        const result = {};
        for (const item of this.find('[name]')) {
            result[item.name] = $(item).val();
        }
        return result;
    }

    validate () {
        this.clearErrors();
        for (const item of this.find('[name]')) {
            const $attr = this.getAttrByElement(item);
            const value = $(item).val();
            if ($attr.hasClass('required') && !value) {
                this.addError(item.name, 'Value cannot be blank');
            }
        }
        return !this.find('.has-error').length;
    }
};

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