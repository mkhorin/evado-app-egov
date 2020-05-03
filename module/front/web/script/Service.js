'use strict';

Front.Service = class Service extends Front.LoadableContent {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'service',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        const formTemplate = data.request ? 'fillForm' : 'unavailable';
        data.fillForm = this.resolveTemplate(formTemplate, data);
        return this.resolveTemplate('service', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        super.onAfterDone();
        this.search = this.getHandler('Search');
    }
};

Front.ServiceList = class ServiceList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 8;
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'service',
            view: 'publicList',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize(),
            filter: this.getFilter()
        };
    }

    getFilter () {
        if (!this.search) {
            return null;
        }
        return [{
            attr: 'name',
            op: 'contains',
            value: this.search
        }];
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.i18n.translate('No services found')});
    }

    renderItem (data) {
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    bindSearch (handler) {
        handler.on('search:change', this.onSearch.bind(this));
    }

    onDone (data) {
        super.onDone(data);
        $(window).scrollTop(0);
    }

    onSearch (event, {search}) {
        this.search = $.trim(search);
        this.pagination.page = 0;
        this.load();
    }

    onChangePagination (event, {page}) {
        this.load();
    }
};

Front.SearchServiceList = class SearchServiceList extends Front.ServiceList {
};

Front.MainServiceList = class MainServiceList extends Front.ServiceList {

    init () {
        super.init();
        this.load();
    }

    getPostData () {
        return {
            class: 'service',
            view: 'publicList',
            start: 0,
            length: 4
        };
    }
};