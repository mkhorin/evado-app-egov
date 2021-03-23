/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Page = class Page extends Front.Element {

    init () {
        this.name = this.getData('page');
        this.front.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        this.front.togglePage(this.name);
    }

    showPage () {
        this.front.showPage(this.name);
    }
};

Front.MainPage = class MainPage extends Front.Page {
};

Front.SearchPage = class SearchPage extends Front.Page {

    init () {
        super.init();
        this.search = this.getHandler('Search');
        this.list = this.getHandler('SearchServiceList');
        this.list.bindSearch(this.search);
    }

    activate (data) {
        super.activate(data);
        this.search.setValue(data.search);
        this.search.triggerChange();
    }
};

Front.ServicePage = class ServicePage extends Front.Page {

    init () {
        super.init();
        this.service = this.getHandler('Service');
        this.front.on('action:service', this.onService.bind(this));
    }

    onService (event, {service}) {
        this.showPage();
        this.service.setInstance(service);
    }
};

Front.RequestFormPage = class RequestFormPage extends Front.Page {

    init () {
        super.init();
        this.form = this.getHandler('RequestForm');
        this.front.on('action:fillForm', this.onFillForm.bind(this));
    }

    onFillForm (event, {service, request, id}) {
        this.showPage();
        this.form.id = id;
        this.form.draft = !!id;
        this.form.setService(service);
        this.form.setRequestName(request);
    }
};

Front.AccountPage = class AccountPage extends Front.Page {

    init () {
        super.init();
        this.list = this.getHandler('RequestList');
        this.front.on('action:account', this.onAccount.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }

    onAccount (event) {
        this.showPage();
    }
};

Front.RequestPage = class RequestPage extends Front.Page {

    init () {
        super.init();
        this.request = this.getHandler('Request');
        this.front.on('action:request', this.onRequest.bind(this));
    }

    onRequest (event, {request, id}) {
        this.showPage();
        this.request.setRequest(id, request);
    }
};

Front.CommentPage = class CommentPage extends Front.Page {

    init () {
        super.init();
        this.comment = this.getHandler('Comment');
        this.front.on('action:comment', this.onComment.bind(this));
    }

    onComment (event, {request, requestName, id}) {
        this.showPage();
        this.find('[data-action="request"]')
            .attr('data-id', request)
            .attr('data-request', requestName);
        this.comment.setComment(id, request, requestName);
    }
};