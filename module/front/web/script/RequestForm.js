'use strict';

Front.RequestForm = class RequestForm extends Front.Loadable {

    init () {
        super.init();
        this.on('click', '[data-command="save"]', this.onSave.bind(this));
        this.on('click', '[data-command="submit"]', this.onSubmit.bind(this));
    }

    setService (service) {
        this.service = service;
    }

    setRequestName (name) {
        this.requestName = name;
        this.clear();
        this.load();
    }

    getForm () {
        return this.getHandler('Form');
    }

    load () {
        if (this.isLoading()) {
            return false;
        }
        this.toggleLoader(true);
        let def = this.loadClass();
        if (!this.id) {
            def = def.then(this.loadActiveRequests.bind(this));
        }
        return def.then(this.loadDraftData.bind(this))
            .then(this.onDone.bind(this))
            .then(this.onAfterDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    loadClass () {
        return this.front.meta.getClass(this.requestName).done(data => this.classData = data);
    }

    loadActiveRequests () {
        const url = this.front.getData('list');
        const data = {
            class: this.requestName,
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
        };
        return this.front.ajaxQueue.post(url, data).then(this.onActiveDone.bind(this));
    }

    onActiveDone (data) {
        const items = data?.items;
        const item = items?.[0];
        this.draft = !items.length || item._state === 'draft';
        this.id = item?._id;
    }

    loadDraftData () {
        if (!this.draft) {
            return $.Deferred().resolve();
        }
        const url = this.front.getData(this.id ? 'read' : 'defaults');
        return this.front.ajaxQueue.post(url, {
            class: this.requestName,
            id: this.id
        });
    }

    render (data = {}) {
        this.data = data;
        data.service = this.service;
        data.title = this.classData.label;
        const group = this.front.meta.getElementGroup('form', this.classData);
        data.form = this.renderElements(group);
        return this.resolveTemplate('form', data);
    }

    renderElements (data) {
        const result = [];
        if (Array.isArray(data._elements)) {
            for (const item of data._elements) {
                result.push(item._group ? this.renderGroup(item) : this.renderAttr(item));
            }
        }
        return result.join('');
    }

    renderGroup (data) {
        data.active = data.active ? 'active' : '';
        data.content = this.renderElements(data);
        return data.content ? this.resolveTemplate('group', data) : '';
    }

    renderAttr (data) {
        data.required = data.required ? 'required' : '';
        data.value = this.data[data.name];
        data.extHint = Jam.escape(data.extHint);
        data.hint = Jam.escape(data.hint);
        switch (data.type) {
            case 'boolean':
                return this.renderBooleanAttr(data);
            case 'date':
                return this.renderDateAttr(data);
            case 'text':
                return this.renderTextAttr(data);
        }
        if (data.viewType === 'select') {
            return this.renderSelectAttr(data);
        }
        return this.renderStringAttr(data);
    }

    renderBooleanAttr (data) {
        return this.resolveTemplate('boolean', data);
    }

    renderDateAttr (data) {
        return this.resolveAttrContent('date', data);
    }

    renderSelectAttr (data) {
        const items = data.enums?.[0]?.items || [];
        const options = items.map(({value, text}) => {
            const selected = data.value === value ? 'selected' : '';
            text = Jam.t(text, 'meta.class.request');
            return `<option value="${value}" ${selected}>${text}</option>`;
        });
        data.options = options.join('');
        return this.resolveAttrContent('select', data);
    }

    renderTextAttr (data) {
        data.rows = 4;
        return this.resolveAttrContent('text', data);
    }

    renderStringAttr (data) {
        return this.resolveAttrContent('string', data);
    }

    resolveAttrContent (name, data) {
        data.content = this.resolveTemplate(name, data);
        return this.resolveTemplate('attr', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        if (this.draft) {
            return super.onAfterDone();
        }
        this.front.trigger('action:request', {
            id: this.id,
            request: this.requestName
        });
    }

    onSave () {
        this.save();
    }

    onSubmit () {
        this.save().done(this.submit.bind(this));
    }

    save () {
        this.getForm().clearErrors();
        this.toggleLoader(true);
        const url = this.front.getData(this.id ? 'update' : 'create');
        const data = {
            class: this.requestName,
            id: this.id,
            data: this.serializeData()
        };
        return this.front.ajaxQueue.post(url, data)
            .done(this.doneSave.bind(this))
            .fail(this.failSave.bind(this));
    }

    submit () {
        this.toggleLoader(true);
        const url = this.front.getData('transit');
        const data = {
            class: this.requestName,
            id: this.id,
            transition: 'submit'
        };
        return this.front.ajaxQueue.post(url, data)
            .done(this.doneSubmit.bind(this))
            .fail(this.failSave.bind(this));
    }

    doneSubmit (data) {
        this.toggleLoader(false);
        this.front.trigger('action:account');
    }

    serializeData () {
        const result = {};
        for (const element of this.find('.form-value')) {
            result[element.name] = element.value;
        }
        return result;
    }

    doneSave (data) {
        this.toggleLoader(false);
        this.id = data;
    }

    failSave (data) {
        this.toggleLoader(false);
        data.responseJSON
            ? this.getForm().addErrors(data.responseJSON)
            : this.getForm().addTopError(data.responseText || data.statusText);
    }
};