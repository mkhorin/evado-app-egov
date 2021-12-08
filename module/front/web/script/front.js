'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        metaUrl: String,
        fileUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        return {
            activePage: 'services',
            activeRequest: null,
            activeRequestClass: null,
            activeRequestComment: null,
            activeService: null
        };
    },
    computed: {
        activePageProps () {
            switch (this.activePage) {
                case 'service':
                    return {
                        key: this.activeService,
                        service: this.activeService
                    };
                case 'request-form':
                    return {
                        key: this.activeService,
                        service: this.activeService
                    };
                case 'request-view':
                    return {
                        key: this.activeRequest,
                        requestClass: this.activeRequestClass,
                        request: this.activeRequest,
                        service: this.activeService
                    };
                case 'request-comment':
                    return {
                        key: this.activeRequestComment,
                        comment: this.activeRequestComment,
                        request: this.activeRequest,
                        requestClass: this.activeRequestClass,
                        service: this.activeService
                    };
            }
        }
    },
    created () {
        this.$on('account', this.onAccount);
        this.$on('request-comment', this.onRequestComment);
        this.$on('request-form', this.onRequestForm);
        this.$on('request-view', this.onRequestView);
        this.$on('service', this.onService);
        this.$on('services', this.onServices);
    },
    methods: {
        onAccount () {
            if (this.requireAuth()) {
                this.activePage = 'account';
            }
        },
        onRequestForm (id) {
            if (this.requireAuth()) {
                this.activePage = 'request-form';
                this.activeService = id;
            }
        },
        onRequestView ({request, requestClass, service}) {
            if (this.requireAuth()) {
                this.activePage = 'request-view';
                this.activeRequest = request;
                this.activeRequestClass = requestClass;
                this.activeService = service;
            }
        },
        onRequestComment ({comment, request, requestClass, service}) {
            this.activePage = 'request-comment';
            this.activeRequestComment = comment;
            this.activeRequest = request;
            this.activeRequestClass = requestClass;
            this.activeService = service;
        },
        onService (id) {
            this.activePage = 'service';
            this.activeService = id;
        },
        onServices () {
            this.activePage = 'services';
        }
    }
});