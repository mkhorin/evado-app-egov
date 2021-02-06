'use strict';

class Front {

    static getElementClass (name) {
        return this[name]?.prototype instanceof this.Element ? this[name] : null;
    }

    static toggle ($element, state) {
        return $element.toggleClass('hidden', !state);
    }

    static getTemplate (name, container) {
        return container.querySelector(`template[data-id="${name}"]`)?.innerHTML;
    }

    static resolveTemplate (text, data, start = '{{', end = '}}') {
        const regex = new RegExp(`${start}(\\w+)${end}`, 'gm');
        return text.replace(regex, (match, key)=> {
            const value = data[key];
            return data.hasOwnProperty(key) && value !== undefined && value !== null ? value : '';
        });
    }

    static setPageTitle (text) {
        const $title = $(document.head).find('title');
        const base = $title.data('title');
        $title.html(text ? `${Jam.t(text)} - ${base}` : base);
    }

    static escapeData (data, keys) {
        for (const key of keys || Object.keys(data)) {
            data[key] = this.escapeHtml(data[key]);
        }
    }

    static escapeHtml (value) {
        return typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
    }

    static createHandlers (front, container) {
        const handlers = [];
        for (const element of container.querySelectorAll('[data-handler]')) {
            const name = $(element).data('handler');
            if (typeof name === 'string') {
                const Class = this.getElementClass(name);
                if (Class) {
                    handlers.push(new Class(element, front));
                } else {
                    console.error(`Handler not found: ${name}`);
                }
            }
        }
        for (const handler of handlers) {
            if (handler.init) {
                handler.init();
            }
        }
    }

    static roundPrice (value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    constructor () {
        this.ajaxQueue = new this.constructor.AjaxQueue;
        this.$container = $('.front');
        this.meta = new this.constructor.Meta(this);
        this.constructor.createHandlers(this, document);
        this.on('click', '[data-action="main"]', this.onMain.bind(this));
        this.on('click', '[data-action="account"]', this.onAccount.bind(this));
        this.on('click', '[data-action="service"]', this.onService.bind(this));
        this.on('click', '[data-action="fillForm"]', this.onFillForm.bind(this));
        this.on('click', '[data-action="request"]', this.onRequest.bind(this));
        this.on('action:auth', this.onAuth.bind(this));
    }

    isGuest () {
        return this.getData('guest');
    }

    getData (key) {
        return this.$container.data(key);
    }

    showPage (name, data) {
        this.trigger('show:page', Object.assign({name}, data));
    }

    getPage (name) {
        return this.getPages().filter(`[data-page="${name}"]`);
    }

    getPages () {
        return this.$container.children('.page');
    }

    togglePage (name) {
        this.getPages().removeClass('active');
        this.getPage(name).addClass('active');
    }

    getActionTarget (event, key = 'id') {
        return $(event.currentTarget).closest(`[data-${key}]`).data(key);
    }

    getHandler (name) {
        return this.$container.find(`[data-handler="${name}"]`).data('handler');
    }

    getAuthAction (action) {
        return `action:${this.isGuest() ? 'auth' : action}`;
    }

    toggleLoader (state) {
        $('.global-loader').toggle(state);
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }

    onMain (event) {
        event.preventDefault();
        this.showPage('main');
    }

    onAccount (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('account'));
    }

    onAuth (event) {
        event.preventDefault();
        location.assign('auth/sign-in?returnUrl=/front');
    }

    onService (event) {
        event.preventDefault();
        const service = this.getActionTarget(event);
        this.trigger('action:service', {service});
    }

    onFillForm (event) {
        event.preventDefault();
        const service = this.getActionTarget(event, 'service');
        const request = this.getActionTarget(event, 'request');
        this.trigger(this.getAuthAction('fillForm'), {service, request});
    }

    onRequest (event) {
        event.preventDefault();
        const id = this.getActionTarget(event);
        const request = this.getActionTarget(event, 'request');
        this.trigger(this.getAuthAction('request'), {id, request});
    }
}

Front.Element = class Element {

    constructor (container, front) {
        this.front = front;
        this.container = container;
        this.$container = $(container);
        this.$container.data('handler', this);
    }

    find () {
        return this.$container.find(...arguments);
    }

    getData (key) {
        return this.$container.data(key);
    }

    getClosestHandler (name) {
        return this.$container.closest(`[data-handler="${name}"]`).data('handler');
    }

    getHandler (name) {
        return this.find(`[data-handler="${name}"]`).data('handler');
    }

    createHandlers () {
        Front.createHandlers(this.front, this.container);
    }

    getTemplate (name) {
        return Front.getTemplate(name, this.container);
    }

    resolveTemplate (name, ...args) {
        return Front.resolveTemplate(this.getTemplate(name), ...args);
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }
};

Front.AjaxQueue = class AjaxQueue {

    constructor () {
        this._tasks = [];
    }

    post (...args) {
        const deferred = $.Deferred();
        this._tasks.push({deferred, args});
        this.execute();
        return deferred;
    }

    remove (deferred) {
        const index = this.getTaskIndex(deferred);
        if (index !== undefined) {
            this._tasks.splice(index, 1);
        }
    }

    getTaskIndex (deferred) {
        for (let i = 0; i < this._tasks.length; ++i) {
            if (this._tasks[i].deferred === deferred) {
                return i;
            }
        }
    }

    execute () {
        if (this._xhr || !this._tasks.length) {
            return false;
        }
        const {deferred, args} = this._tasks.splice(0, 1)[0];
        const csrf = Jam.getCsrfToken();
        const data = {csrf, ...args[1]};
        const params = {
            method: 'post',
            contentType: 'application/json',
            url: args[0],
            data: JSON.stringify(data)
        };
        this._xhr = $.ajax(params)
            .always(() => this._xhr = null)
            .done(data => deferred.resolve(data))
            .fail(data => deferred.reject(data));
        deferred.done(this.next.bind(this));
        deferred.fail(this.next.bind(this));
    }

    next () {
        this.execute();
    }

    abort () {
        this._xhr?.abort();
        this._xhr = null;
    }
};

Front.Loadable = class Loadable extends Front.Element {

    init () {
        this.$content = this.$container.children('.loadable-content');
    }

    isLoading () {
        return this.$container.hasClass('loading');
    }

    getUrl (key = 'url') {
        return this.getData(key) || this.front.getData(key);
    }

    setInstance (id) {
        if (this.id !== id) {
            this.id = id;
            this.clear();
            this.load();
        }
    }

    load () {
        if (this.isLoading()) {
            return false;
        }
        this.toggleLoader(true);
        this._deferred = this.front.ajaxQueue
            .post(this.getUrl(), this.getPostData())
            .done(this.onDone.bind(this))
            .done(this.onAfterDone.bind(this))
            .fail(this.onFail.bind(this));
        return this._deferred;
    }

    getPostData () {
        return null;
    }

    toggleLoader (state) {
        this.$container.toggleClass('loading', state);
    }

    onDone (data) {
        this.toggleLoader(false);
        this.$content.html(this.render(data));
        Jam.t(this.$container);
        Jam.Helper.executeSerialImageLoading(this.$container);
    }

    onAfterDone () {
        this.createHandlers();
    }

    onFail (data) {
        this.toggleLoader(false);
        this.$content.html(this.renderError(data));
    }

    clear () {
        this.$content.html('');
    }

    render (data) {
        return data;
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }
};

Front.Pagination = class Pagination {

    constructor (list) {
        this.list = list;
        this.page = 0;
        this.pageSize = 10;
        this.list.on('click', '.pagination [data-action="first"]', this.onFirst.bind(this));
        this.list.on('click', '.pagination [data-action="prev"]', this.onPrev.bind(this));
        this.list.on('click', '.pagination [data-action="next"]', this.onNext.bind(this));
        this.list.on('click', '.pagination [data-action="last"]', this.onLast.bind(this));
        this.list.on('click', '.pagination [data-page]', this.onPage.bind(this));
    }

    isValidPage (page) {
        return Number.isInteger(page) && page >= 0 && page < this.numPages;
    }

    getOffset () {
        return this.page * this.pageSize;
    }

    getPageSize () {
        return this.pageSize;
    }

    onFirst (event) {
        event.preventDefault();
        this.setPage(0);
    }

    onPrev (event) {
        event.preventDefault();
        this.setPage(this.page - 1);
    }

    onLast (event) {
        event.preventDefault();
        this.setPage(this.numPages - 1);
    }

    onNext (event) {
        event.preventDefault();
        this.setPage(this.page + 1);
    }

    onPage (event) {
        event.preventDefault();
        this.setPage(event.target.dataset.page);
    }

    setPage (page) {
        page = Number(page);
        if (page !== this.page && this.isValidPage(page)) {
            this.page = page;
            this.list.trigger('change:pagination', {page});
        }
    }

    setTotal (total) {
        total = Number.isInteger(total) ? total : 0;
        this.numPages = Math.ceil(total / this.pageSize);
    }

    render () {
        if (this.numPages < 2) {
            return '';
        }
        const pages = this.renderPages();
        return this.list.resolveTemplate('pagination', {pages});
    }

    renderPages () {
        const result = [];
        for (let page = 0; page < this.numPages; ++page) {
            const active = page === this.page ? 'active' : '';
            const text = page + 1;
            result.push(this.list.resolveTemplate('page', {active, page, text}));
        }
        return result.join('');
    }
};

Front.Meta = class Meta {

    constructor (front) {
        this.front = front;
        this._classMap = {};
    }

    getClass (name) {
        return this._classMap.hasOwnProperty(name)
            ? $.Deferred().resolve(this._classMap[name])
            : this.load('class', {class: name}).done(data => this._classMap[name] = data);
    }

    getUrl (key) {
        return this.front.getData('meta-'+ key);
    }

    load (key, data) {
        return $.post(this.getUrl(key), data).fail(this.onFail.bind(this));
    }

    onFail () {
    }

    getElementGroup (groupName, data) {
        this.prepareClassElements(data);
        if (Array.isArray(data.groups)) {
            for (const group of data.groups) {
                if (group.name === groupName) {
                    return group;
                }
            }
        }
    }

    prepareClassElements (data) {
        if (data._elements) {
            return;
        }
        const groupMap = Jam.ArrayHelper.index('name', data.groups);
        data._elements = [];
        for (const group of Object.values(groupMap)) {
            group._group = true;
            groupMap.hasOwnProperty(group.parent)
                ? Jam.ObjectHelper.push(group, '_elements', groupMap[group.parent])
                : data._elements.push(group);
        }
        for (const attr of data.attrs) {
            groupMap.hasOwnProperty(attr.group)
                ? Jam.ObjectHelper.push(attr, '_elements', groupMap[attr.group])
                : data._elements.push(attr);
        }
        const compare = (a, b) => a.orderNumber - b.orderNumber;
        for (const group of Object.values(groupMap)) {
            if (group._elements) {
                data._elements.sort(compare);
            }
        }
        data._elements.sort(compare);
    }

    getStateTitle (stateName, className) {
        if (!this._classMap.hasOwnProperty(className)) {
            return stateName;
        }
        const states = this._classMap[className].states;
        const index = Jam.ArrayHelper.searchByNestedValue(stateName, 'name', states);
        return index === -1 ? stateName : states[index].label;
    }

    formatAsEnum (value, {enums}, ...args) {
        const items = enums?.[0]?.items || [];
        for (const item of items) {
            if (item.value === value) {
                return Jam.t(item.text, ...args);
            }
        }
        return value;
    }
};