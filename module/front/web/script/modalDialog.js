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
            },
            visible: false
        };
    },
    mounted () {
        this.$el.addEventListener('hidden.bs.modal', this.onHidden.bind(this));
        this.$el.addEventListener('shown.bs.modal', this.onShown.bind(this));
        this.modal = new bootstrap.Modal(this.$el);
    },
    methods: {
        show () {
            this.modal?.show(...arguments);
        },
        hide () {
            this.modal?.hide(...arguments);
        },
        onHidden () {
            this.visible = false;
            this.$emit('hidden');
        },
        onShown () {
            this.visible = true;
            this.$emit('shown');
        }
    },
    template: '#modal-dialog'
});