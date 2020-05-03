'use strict';

const Base = require('evado-module-office/Module');

module.exports = class OfficeModule extends Base {

    constructor (config) {
        super({
            original: Base,
            ...config
        });
    }
};
module.exports.init(module);