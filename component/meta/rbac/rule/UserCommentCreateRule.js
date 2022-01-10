/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 *
 * User can create comments related to his own non-draft requests
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class UserCommentCreateRule extends Base {

    async execute () {
        const data = this.getPostData();
        const request = data?.request?.links;
        if (!request) {
            return false;
        }
        const requestClass = this.getBaseMeta().getClass('request');
        const query = requestClass.findById(request).byCreator(this.getUserId());
        const state = await query.scalar(requestClass.STATE_ATTR);
        return state !== 'draft';
    }
};