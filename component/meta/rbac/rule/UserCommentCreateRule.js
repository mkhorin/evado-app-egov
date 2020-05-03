/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// user can create comments related to his own non-draft requests

module.exports = class UserCommentCreateRule extends Base {

    async execute () {
        const data = this.getPostData();
        const requestId = data && data.request && data.request.links && data.request.links[0];
        if (!requestId) {
            return false;
        }
        const requestClass = this.getTarget().meta.getClass('request');
        const query = requestClass.findById(requestId).and({_creator: this.getUser().getId()});
        const state = await query.scalar('_state');
        return state !== 'draft';
    }
};