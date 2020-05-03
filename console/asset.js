'use strict';

// set NODE_ENV=development
// node console/asset --action install
// node console/asset --action deploy

const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});
const {action} = Console.parseProcessArguments();

(async () => {
    switch (action) {
        case 'install':
            await instance.installAssets();
            break;
        case 'deploy':
            await instance.deployAssets();
            break;
        default:
            instance.log('error', `Unknown action: ${action}`);
    }
    process.exit();
})();