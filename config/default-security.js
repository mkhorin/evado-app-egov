'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {type: 'all'}
    }, {
        roles: ['guest', 'manager', 'user'],
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: ['icon', 'service']
        }
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'comment'
        },
        rule: 'User comment read'
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'create',
        targets: {
            type: 'class',
            class: 'comment'
        },
        rule: 'User comment create'
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'document'
        },
        rule: 'User document read'
    }, {
        roles: 'user',
        type: 'allow',
        actions: 'create',
        targets: {
            type: 'class',
            class: 'document'
        }
    }, {
        roles: 'user',
        type: 'allow',
        actions: ['create', 'read'],
        targets: {
            type: 'class',
            class: 'request'
        },
        rule: 'Creator'
    }, {
        description: 'Users can only update their own draft requests',
        roles: 'user',
        type: 'allow',
        actions: 'update',
        targets: {
            type: 'state',
            class: 'request',
            state: 'draft'
        },
        rule: 'Creator'
    }, {
        roles: 'manager',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: ['comment', 'document', 'icon', 'request', 'service']
        }
    }, {
        roles: 'manager',
        type: 'allow',
        actions: ['create', 'update', 'delete'],
        targets: {
            type: 'class',
            class: ['comment', 'document']
        },
        rule: 'Creator'
    }, {
        roles: 'manager',
        type: 'allow',
        actions: 'update',
        targets: {
            type: 'class',
            class: 'request'
        }
    }, {
        description: 'Deny access to all draft requests',
        roles: 'manager',
        type: 'deny',
        actions: 'all',
        targets: {
            type: 'state',
            class: 'request',
            state: 'draft'
        }
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
            description: 'Default role for new registered user'
        }
    },

    assignments: {
        'Adam': 'administrator',
        'Mario': 'manager'
    },

    rules: {
        'Creator': {
            description: 'Check user is object creator',
            config: '{"Class": "evado/component/meta/rbac/rule/UserRule", "attr": "_creator"}'
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