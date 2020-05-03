'use strict';

Front.Comment = class Comment extends Front.LoadableContent {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'comment',
            view: 'readByUser',
            id: this.id
        };
    }

    setComment (id, request, requestName) {
        this.id = id;
        this.request = request;
        this.requestName = requestName;
        this.clear();
        this.load();
    }

    render (data) {
        this.data = data;
        data.date = Jam.FormatHelper.asDatetime(data._createdAt);
        data.sender = data._creator_title || data._creator;
        data.request = this.request;
        data.requestName = this.requestName;
        data.message = Jam.Helper.escapeTags(data.message);
        data.docs = this.renderDocuments(data.documents);
        return this.resolveTemplate('item', data);
    }

    renderDocuments (items) {
        items = Array.isArray(items) ? items.map(this.renderDocument, this) : [];
        return items.length ? this.resolveTemplate('docs', {docs: items.join('')}) : '';
    }

    renderDocument (data) {
        data.size = Jam.FormatHelper.asBytes(data._size);
        return this.resolveTemplate('doc', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

};

Front.CommentList = class CommentList extends Front.LoadableContent {

    init () {
        super.init();
        this.requestId = this.getData('request');
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 5;
        this.$new = this.find('.comment-modal');
        this.$newError = this.$new.find('.modal-error');
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.on('click', '[data-action="detail"]', this.onDetail.bind(this));
        this.on('click', '[data-command="create"]', this.onCreate.bind(this));
        this.on('click', '[data-command="send"]', this.onSend.bind(this));
        this.load();
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'comment',
            view: 'listByRequest',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize(),
            filter: [{
                attr: 'request',
                op: 'equal',
                value: this.requestId
            }]
        };
    }

    onChangePagination () {
        this.load();
    }

    resolveTemplate (name, data) {
        return super.resolveTemplate(name, data, '##', '##');
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        const template = items ? 'list' : 'empty';
        return this.resolveTemplate(template, {items});
    }

    renderItem (data) {
        data.date = Jam.FormatHelper.asDatetime(data._createdAt);
        data.sender = data._creator_title || data._creator;
        data.message = Jam.Helper.escapeTags(data.message);
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

    onCreate () {
        this.getHandler('Form').trigger('form:clear');
        this.$newError.addClass('hidden');
        this.$new.modal();
    }

    onSend () {
        const form = this.getHandler('Form');
        if (!form.validate()) {
            return false;
        }
        const data = {
            class: 'comment',
            data: form.serialize()
        };
        data.data.request = {links: [this.requestId]};
        this.front.ajaxQueue.post(this.front.getData('create'), data)
            .done(this.onSendDone.bind(this))
            .fail(this.onSendFail.bind(this));
    }

    onSendDone (data) {
        this.$new.modal('hide');
        this.load();
    }

    onSendFail (data) {
        this.$newError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};