'use strict';
/**
 * Task management
 *
 * node console/task
 */
const Application = require('../Application');
const Console = require('evado/console/Console');
const instance = new Console({Application});

(async () => {
    await instance.createTasks();
    process.exit();
})();