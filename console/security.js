'use strict';

// set NODE_ENV=development
// node console/security --action create-users // from configuration
// node console/security --action create-user --name Name --email Email --password Password
// node console/security --action create-security
// node console/security --action change-password --email Email --password Password
// node console/security --action assign-role --email Email --role Role
// node console/security --action export [--file default] [--users false] [--space 2]
// node console/security --action import [--file default] [--users false] [--clear false] [--clearUsers false]
// node console/security --action clear [--clearUsers false]

const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});
const params = Console.parseProcessArguments();

(async () => {
    switch (params.action) {
        case 'create-users':
            await instance.createUsers(); // from configuration
            break;
        case 'create-user':
            await instance.createUser(params);
            break;
        case 'create-security':
            await instance.createSecurity(); // from configuration
            break;
        case 'change-password':
            await instance.changePassword(params);
            break;
        case 'assign-role':
            await instance.assignRole(params);
            break;
        case 'export':
            await instance.exportSecurity(params);
            break;
        case 'import':
            await instance.importSecurity(params);
            break;
        case 'clear':
            await instance.clearSecurity(params);
            break;
        default:
            instance.log('error', `Unknown action: ${params.action}`);
    }
    process.exit();
})();