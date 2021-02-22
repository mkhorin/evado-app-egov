/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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