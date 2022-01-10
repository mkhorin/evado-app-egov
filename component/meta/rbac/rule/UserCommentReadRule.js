/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 *
 * User can read comments related to his own requests
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class UserCommentReadRule extends Base {

    async execute () {
        if (!this.isObjectTarget()) {
            return true; // filter by getObjectFilter
        }
        const model = this.getTarget();
        const requestClass = model.class.meta.getClass('request');
        const query = requestClass.findById(model.get('request'));
        const requestId = await query.byCreator(this.getUserId()).id();
        return !!requestId;
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        const requestClass = this.getBaseMeta().getClass('request');
        const query = requestClass.findByCreator(this.getUserId());
        return {request: await query.ids()};
    }
};