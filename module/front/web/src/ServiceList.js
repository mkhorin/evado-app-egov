/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.ServiceList = class ServiceList extends Front.Loadable {

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
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No services found')});
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