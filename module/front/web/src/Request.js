/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Request = class Request extends Front.Loadable {

    init () {
        super.init();
        this.on('click', '[data-action="comment"]', this.onComment.bind(this));
    }

    setRequest (id, name) {
        this.id = id;
        this.requestName = name;
        this.clear();
        this.load();
    }

    load () {
        if (this.isLoading()) {
            return false;
        }
        this.toggleLoader(true);
        return this.loadClass()
            .then(()=> this.loadRequest())
            .then(this.onDone.bind(this))
            .then(this.onAfterDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    loadClass () {
        return this.front.meta.getClass(this.requestName).done(data => this.classData = data);
    }

    loadRequest () {
        return this.front.ajaxQueue.post(this.getUrl('read'), {
            class: this.requestName,
            id: this.id
        });
    }

    render (data) {
        this.data = data;
        data.title = data.service ? data.service._title : data._class;
        data.icon = data.service ? data.service.icon : '';
        const state = data._state;
        data.state = this.front.meta.getStateTitle(state, this.requestName);
        data.stateCss = state === 'rejected' ? 'text-danger' : state === 'approved' ? 'text-success' : '';
        const group = this.front.meta.getElementGroup('form', this.classData);
        data.form = this.renderElements(group);
        return this.resolveTemplate('item', data);
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
        data.value = this.renderAttrValue(this.data[data.name], data);
        data.content = this.resolveTemplate('static', data);
        return this.resolveTemplate('attr', data);
    }

    renderAttrValue (value, data) {
        switch (data.type) {
            case 'boolean':
                return Jam.FormatHelper.asBoolean(value);
            case 'date':
                return Jam.FormatHelper.asDate(value);
        }
        value = this.front.meta.formatAsEnum(value, data, 'meta.class.request');
        return Jam.escape(value);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    serializeData () {
        const result = {};
        for (const element of this.find('.form-value')) {
            result[element.name] = element.value;
        }
        return result;
    }

    onComment (event) {
        event.preventDefault();
        const {id} = $(event.currentTarget).closest('.comment-item').data();
        const requestName = this.requestName;
        const request = this.id;
        this.front.trigger(`action:comment`, {request, requestName, id});
    }
};