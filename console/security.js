'use strict';
/**
 * Security management
 *
 * set NODE_ENV=development
 * node console/security --action createUsers
 * node console/security --action createUser --name Name --email Email --password Password
 * node console/security --action updateUser --email Email --attr blocked --value false
 * node console/security --action changePassword --email Email --password Password
 * node console/security --action createSecurity
 * node console/security --action assignRole --email Email --role Role
 * node console/security --action export [--file default] [--users false] [--space 2]
 * node console/security --action import [--file default] [--users false] [--clear false] [--clearUsers false]
 * node console/security --action clear [--clearUsers false]
 */
const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});
const params = Console.parseProcessArguments();

(async () => {
    switch (params.action) {
        case 'createUsers':
            await instance.createUsers(); // from configuration
            break;
        case 'createUser':
            await instance.createUser(params);
            break;
        case 'updateUser':
            await instance.updateUser(params);
            break;
        case 'changePassword':
            await instance.changePassword(params);
            break;
        case 'createSecurity':
            await instance.createSecurity(); // from configuration
            break;
        case 'assignRole':
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