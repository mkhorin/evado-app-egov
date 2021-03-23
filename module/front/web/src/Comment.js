/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Comment = class Comment extends Front.Loadable {

    init () {
        super.init();
        this.on('click', '[data-command="backRequest"]', this.onBackRequest.bind(this));
    }

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
        data.message = Jam.StringHelper.escapeTags(data.message);
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

    onBackRequest () {
        this.front.getHandler('RequestPage').showPage();
    }
};