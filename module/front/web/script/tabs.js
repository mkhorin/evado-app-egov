'use strict';

Vue.component('tabs', {
    props: {
        items: Array
    },
    data () {
        return {
            activeIndex: 0
        };
    },
    methods: {
        onTab (index) {
            this.activeIndex = index;
        }
    },
    template: '#tabs'
});