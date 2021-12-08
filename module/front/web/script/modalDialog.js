'use strict';

Vue.component('modal-dialog', {
    props: {
        title: String,
        size: String
    },
    data () {
        return {
            css: {
                'modal-dialog': true,
                'modal-sm': this.size === 'sm',
                'modal-lg': this.size === 'lg',
                'modal-xl': this.size === 'xl'
            }
        };
    },
    template: '#modal-dialog'
});