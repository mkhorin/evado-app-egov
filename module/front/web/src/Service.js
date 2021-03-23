/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Service = class Service extends Front.Loadable {

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