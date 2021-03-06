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
        const query = commentClass.find({
            request: requests,
            documents: model.getId()
        });
        return !!(await query.id());
    }

    async getObjectFilter () { // filter objects in list
        const meta = this.getBaseMeta();
        const requestClass = meta.getClass('request');
        const requests = await requestClass.findByCreator(this.getUserId()).ids();
        const commentClass = meta.getClass('comment');
        const documents = await commentClass.find({request: requests}).column('documents');
        return {_id: [].concat(...documents)};
    }
};