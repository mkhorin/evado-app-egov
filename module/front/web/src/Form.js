/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Form = class Form extends Front.Element {

    init () {
        this.$topError = this.find('.form-error');
        this.on('form:clear', this.onClear.bind(this));
        this.on('click', '.nav-link', this.onTab.bind(this));
        this.on('click', '.form-set-toggle', this.onGroup.bind(this));
    }

    onClear () {
        this.find('[name]').val('');
    }

    onTab (event) {
        event.preventDefault();
        const $nav = $(event.currentTarget);
        const $content = $nav.closest('.tabs').children('.tab-content');
        $nav.parent().children('.active').removeClass('active');
        $content.children('.active').removeClass('active');
        $nav.addClass('active');
        $content.children(`[data-id="${$nav.data('id')}"]`).addClass('active');
    }

    onGroup (event) {
        const $group = $(event.currentTarget).closest('.form-set').toggleClass('active');
    }

    getAttr (name) {
        return this.getAttrByElement(this.getValueElement(name));
    }

    getAttrByElement (element) {
        return this.find(element).closest('.form-attr');
    }

    getValue (name) {
        return this.getValueElement(name).val();
    }

    setValue (name, value) {
        return this.getValueElement(name).val(value);
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
            return false;
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