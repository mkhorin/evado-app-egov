'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        type: 'allow',
        roles: ['administrator'],
        actions: ['all'],
        targets: [{type: 'all'}]
    }, {
        type: 'allow',
        roles: ['guest', 'manager', 'user'],
        actions: ['read'],
        targets: [{
            type: 'class',
            class: ['icon', 'service']
        }]
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['read'],
        targets: [{
            type: 'class',
            class: 'comment'
        }],
        rule: 'User comment read'
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['create'],
        targets: [{
            type: 'class',
            class: 'comment'
        }],
        rule: 'User comment create'
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['read'],
        targets: [{
            type: 'class',
            class: 'document'
        }],
        rule: 'User document read'
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['create'],
        targets: [{
            type: 'class',
            class: 'document'
        }]
    }, {
        type: 'allow',
        roles: ['user'],
        actions: ['create', 'read'],
        targets: [{
            type: 'class',
            class: 'request'
        }],
        rule: 'Author'
    }, {
        description: 'Users can only update their own draft requests',
        type: 'allow',
        roles: ['user'],
        actions: ['update'],
        targets: [{
            type: 'state',
            class: 'request',
            state: 'draft',
        }],
        rule: 'Author'
    }, {
        type: 'allow',
        roles: ['manager'],
        actions: ['read'],
        targets: [{
            type: 'class',
            class: ['comment', 'document', 'icon', 'request', 'service']
        }]
    }, {
        type: 'allow',
        roles: ['manager'],
        actions: ['create', 'update', 'delete'],
        targets: [{
            type: 'class',
            class: ['comment', 'document']
        }],
        rule: 'Author'
    }, {
        type: 'allow',
        roles: ['manager'],
        actions: ['update'],
        targets: [{
            type: 'class',
            class: 'request'
        }]
    }, {
        description: 'Deny access to all draft requests',
        type: 'deny',
        roles: ['manager'],
        actions: ['all'],
        targets: [{
            type: 'state',
            class: 'request',
            state: 'draft'
        }]
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Admin module',
            description: 'Access to Admin module'
        },
        'moduleOffice': {
            label: 'Office module',
            description: 'Access to Office module'
        },
        'moduleStudio': {
            label: 'Studio module',
            description: 'Access to Studio module'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to all',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'upload'
            ]
        },
        'manager': {
            label: 'Manager',
            description: 'Role for serving user requests',
            children: [
                'moduleOffice'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        },
        'user': {
            label: 'User',
            description: 'Auto-assigned role for new user'
        }
    },

    assignments: {
        'Adam': ['administrator'],
        'Mario': ['manager']
    },

    rules: {
        'Author': {
            description: 'Check user is object creator',
            config: '{"Class": "evado/component/meta/rbac/rule/AuthorRule"}'
        },
        'User comment create': {
            description: 'User can create comments related to his own non-draft requests',
            config: '{"Class": "component/meta/rbac/rule/UserCommentCreateRule"}'
        },
        'User comment read': {
            description: 'User can read comments related to his own requests',
            config: '{"Class": "component/meta/rbac/rule/UserCommentReadRule"}'
        },
        'User document read': {
            description: 'User can read documents related to his own requests',
            config: '{"Class": "component/meta/rbac/rule/UserDocumentReadRule"}'
        }
    }
};