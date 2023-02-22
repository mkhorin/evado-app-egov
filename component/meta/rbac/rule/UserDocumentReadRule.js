/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 *
 * User can read documents related to his own requests (via comments)
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class UserDocumentReadRule extends Base {

    async execute () {
        if (!this.isObjectTarget()) {
            return true;
        }
        const model = this.getTarget();
        const requestClass = model.class.meta.getClass('request');
        const requestQuery = requestClass.findByCreator(this.getUserId());
        const requests = await requestQuery.ids();
        const commentClass = requestClass.meta.getClass('comment');
        const commentQuery = commentClass.find({
            request: requests,
            documents: model.getId()
        });
        const id = await commentQuery.id();
        return !!id;
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        const meta = this.getBaseMeta();
        const requestClass = meta.getClass('request');
        const requestQuery = requestClass.findByCreator(this.getUserId());
        const requests = await requestQuery.ids();
        const commentClass = meta.getClass('comment');
        const commentQuery = commentClass.find({request: requests});
        const documents = await commentQuery.column('documents');
        return {_id: [].concat(...documents)};
    }
};