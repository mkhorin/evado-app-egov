'use strict';

Front.Search = class Search extends Front.Element {

    constructor () {
        super(...arguments);
        this.$search = this.find('[type="search"]');
        this.on('submit', this.onSubmit.bind(this));
        this.on('search:clear', this.onClear.bind(this));
    }

    setValue (value) {
        this.$search.val(value);
    }

    onClear () {
        this.$search.val('');
        this.triggerChange();
    }

    onSubmit (event) {
        event.preventDefault();
        this.triggerChange();
    }

    triggerChange () {
        this.$container.trigger('search:change', {search: this.$search.val()});
    }
};

Front.MainSearch = class MainSearch extends Front.Element {

    constructor () {
        super(...arguments);
        this.$search = this.find('[type="search"]');
        this.on('submit', this.onSubmit.bind(this));
    }

    onSubmit (event) {
        event.preventDefault();
        this.front.showPage('search', {
            search: this.$search.val()
        });
    }
};