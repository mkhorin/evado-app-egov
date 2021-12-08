'use strict';

Vue.component('model-form-attr', {
    props: {
        element: Object,
        translationCategory: String
    },
    data () {
        return {
            name: null,
            label: null,
            hint: null,
            extHint: null,
            error: null,
            readOnly: false,
            refClass: null,
            value: null,
            ...this.element
        };
    },
    watch: {
        value () {
            this.clearError();
            this.$emit('change');
        }
    },
    methods: {
        translate (text) {
            return Jam.t(text, this.translationCategory);
        },
        validate () {
            return this.validateRequired();
        },
        validateRequired () {
            if (this.required && !this.value) {
                this.setError('Value cannot be blank');
                return false;
            }
            return true;
        },
        clearError () {
            this.error = null;
        },
        hasError () {
            return !!this.error;
        },
        setError (text) {
            this.error = Jam.t(text);
        },
        serialize () {
            return this.value;
        },
        reset () {
            this.clearValue();
        },
        clearValue () {
            this.value = '';
        }
    }
});