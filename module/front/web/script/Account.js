'use strict';

Front.Account = class Account extends Front.LoadableContent {
};

Front.RequestList = class RequestList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 5;
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.on('click', '[data-action="detail"]', this.onDetail.bind(this));
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'request',
            view: 'listByUser',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
    }

    onChangePagination (event, {page}) {
        this.load();
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        const template = items ? 'list' : 'empty';
        return this.resolveTemplate(template, {items});
    }

    renderItem (data) {
        data.class = data._class;
        data.classTitle = data._class_title;
        data.state = data._state;
        data.stateTitle = data._state_title;
        data.stateCss = data.state === 'rejected' ? 'text-danger' : data.state === 'approved' ? 'text-success' : '';
        if (data.service) {
            data.icon = data.service.icon;
            data.serviceTitle = data.service._title;
            data.service = data.service._id;
        }
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data && data.totalSize);
        this.$content.append(this.pagination.render());
        this.translateContainer();
    }

    onDetail (event) {
        event.preventDefault();
        const {id, request, state, service} = $(event.currentTarget).closest('.request-item').data();
        const action = state === 'draft' ? 'fillForm' : 'request';
        this.front.trigger(`action:${action}`, {request, service, id});
    }
};

