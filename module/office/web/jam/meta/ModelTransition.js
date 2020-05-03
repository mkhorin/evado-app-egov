/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.RequestModelTransition = class RequestModelTransition extends Jam.ModelTransition {

    forceExecute () {
        return super.forceExecute().done(() => {
            this.model.modal.one('afterLoad', this.onAfterLoad.bind(this));
        });
    }

    onAfterLoad () {
        const model = this.model.findInstanceByModal();
        const id = model.getAttr('lastComment').getValue();
        if (id) {
            model.childModal.load('office/model/update?c=comment', {id});
        }
    }
};