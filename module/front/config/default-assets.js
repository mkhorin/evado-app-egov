/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    build: [{
        Class: 'Packer',
        sources: [
            'src/Front.js',
            'src/Element.js',
            'src/Loadable.js',
            'src'
        ],
        target: 'vendor/front.min.js'
    }]
};