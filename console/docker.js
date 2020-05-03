'use strict';

const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});

(async () => {
    await instance.deployAssets();
    await instance.importDataFiles();
    await instance.startApp();
})();