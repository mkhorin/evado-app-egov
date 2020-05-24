/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// user can read documents related to his own requests (via comments)

module.exports = class UserDocumentReadRule extends Base {

    async execute () {
        if (!this.isObjectTarget()) {
            return true;
        }
        const model = this.getTarget();
        const requestClass = model.class.meta.getClass('request');
        const requests = await requestClass.findByCreator(this.getUserId()).ids();
        const commentClass = requestClass.meta.getClass('comment');
        const query = commentClass.find().and({
            request: requests,
            documents: model.getId()
        });
        return !!(await query.id());
    }

    async getObjectFilter () {
        const requestClass = this.getTarget().meta.getClass('request');
        const requests = await requestClass.findByCreator(this.getUserId()).ids();
        const commentClass = requestClass.meta.getClass('comment');
        const documents = await commentClass.find().and({request: requests}).column('documents');
        return {_id: [].concat(...documents)};
    }
};