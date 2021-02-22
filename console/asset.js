'use strict';
/**
 * Asset management
 *
 * set NODE_ENV=development
 * node console/asset --action install [--withModules true] [--module name]
 * node console/asset --action build [--withModules true] [--module name]
 * node console/asset --action deploy [--withModules true] [--module name]
 * node console/asset --action build-deploy [--withModules true] [--module name]
 */
const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});
const params = Console.parseProcessArguments();

(async () => {
    switch (params.action) {
        case 'install':
            await instance.installAssets(params);
            break;
        case 'build':
            await instance.buildAssets(params);
            break;
        case 'deploy':
            await instance.deployAssets(params);
            break;
        case 'build-deploy':
            await instance.buildAssets(params);
            await instance.deployAssets(params);
            break;
        default:
            instance.log('error', `Unknown action: ${params.action}`);
    }
    process.exit();
})();