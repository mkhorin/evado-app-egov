/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// user can read comments related to his own requests

module.exports = class UserCommentReadRule extends Base {

    async execute () {
        if (!this.isObjectTarget()) {
            return true; // filter by getObjectFilter
        }
        const model = this.getTarget();
        const requestClass = model.class.meta.getClass('request');
        const query = requestClass.findById(model.get('request'));
        const requestId = await query.and({[requestClass.CREATOR_ATTR]: this.getUserId()}).id();
        return !!requestId;
    }

    async getObjectFilter () {
        const requestClass = this.getTarget().meta.getClass('request');
        const query = requestClass.findByCreator(this.getUserId());
        return {request: await query.ids()};
    }
};