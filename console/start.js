'use strict';
/**
 * Start app
 *
 * node console/start [--config name] [--port number]
 */
const Application = require('../Application');
const Console = require('evado/console/Console');
const params = Console.parseProcessArguments();
const instance = new Console({Application, params});

(async () => {
    await instance.startApp();
})();