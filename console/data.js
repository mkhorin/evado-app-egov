'use strict';
/**
 * Data management
 *
 * set NODE_ENV=development
 * node console/data --action export [--dir default] [--files true] [--space 2] [--includes table1] [--includes table2]
 * node console/data --action import [--dir default] [--files true] [--clear false] [--oneByOne true]
 * node console/data --action clear [--meta document] [--files true] [--excludes table1] [--excludes table2]
 */
const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});
const params = Console.parseProcessArguments();

(async () => {
    switch (params.action) {
        case 'export': {
            await instance.exportData(params);
            break;
        }
        case 'import': {
            await instance.importData(params);
            break;
        }
        case 'clear': {
            await instance.clearData(params);
            break;
        }
        default: {
            instance.log('error', `Unknown action: ${params.action}`);
        }
    }
    process.exit();
})();