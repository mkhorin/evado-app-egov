/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.RequestModelTransition = class RequestModelTransition extends Jam.ModelTransition {

    forceExecute () {
        return super.forceExecute().done(() => {
            this.model.frame.one('afterLoad', this.onAfterLoad.bind(this));
        });
    }

    onAfterLoad () {
        const model = this.model.findInstanceByFrame();
        const id = model.getAttr('lastComment').getValue();
        if (id) {
            model.childFrame.load('office/model/update?c=comment', {id});
        }
    }
};