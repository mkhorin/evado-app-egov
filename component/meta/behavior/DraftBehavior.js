/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class DraftBehavior extends Base {

    async beforeValidate () {
        const state = this.owner.getStateName();
        if (this.owner.isNew() || state === 'draft') {
            this.extractRequiredValidators(); // to save draft without required data
        } else {
            this.unsetFormGroupValues();
        }
        await this.checkServiceActivity();
        await this.checkRequestCounter();
    }

    unsetFormGroupValues () {
        const group = this.owner.view.grouping.getGroup('form');
        if (group) {
            const attrs = group.getAllAttrs();
            for (const attr of attrs) {
                this.owner.restoreOldValue(attr);
            }
        }
    }

    async checkServiceActivity () {
        if (this.owner.isNew()) {
            const service = await this.getRelated('service');
            if (!service || !service.get('active')) {
                this.owner.addError('service', `Service is unavailable`);
            }
        }
    }

    async checkRequestCounter () {
        if (!this.owner.isNew()) {
            return true;
        }
        const cls = this.owner.class;
        const creator = this.owner.getCreator();
        const query = cls.findByState('draft').byCreator(creator);
        const found = await query.id();
        if (found) {
            this.owner.addError(cls.CLASS_ATTR, `Draft already exists: ${found}`);
        }
    }

    async beforeTransit () {
        const state = this.owner.getStateName();
        if (state === 'draft') {
            const validators = this.extractRequiredValidators();
            for (const validator of validators) {
                await validator.execute(this.owner);
            }
        }
    }

    async afterTransit ({transition}) {
        await this.createTransitComment(transition);
    }

    extractRequiredValidators () {
        if (!this._requiredValidators) {
            this._requiredValidators = [];
            const validators = this.owner.ensureValidators();
            for (let i = validators.length - 1; i >= 0; --i) {
                if (validators[i] instanceof RequiredValidator) {
                    this._requiredValidators.push(...validators.splice(i, 1));
                }
            }
        }
        return this._requiredValidators;
    }

    createTransitComment (transition) {
        const commentClass = this.getMetadataClass('comment');
        const comment = this.owner.createByView(commentClass);
        comment.assign({
            type: 'event',
            request: this.owner.getId(),
            message: transition.options.comment || transition.title
        });
        return comment.forceSave();
    }
};

const RequiredValidator = require('evado-meta-base/validator/RequiredValidator');