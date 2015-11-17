/**
 * This file contains mainModule with injecting dependencies, routing and configuration.
 *
 * @version 1.0
 * @author Dmitry
 * @since 04.09.2015
 */
angular.module("mainModule", ['gettext', 'ui.utils', 'ui.router', 'angularMoment', 'ngMaterial', 'md.data.table',
    'angular-loading-bar', 'templates', 'angular-cache', 'duScroll', 'chart.js', 'ngFileUpload', 'vcRecaptcha'])
    .value('duScrollDuration', 3000)
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
            //$locationProvider.html5Mode(true);

            $stateProvider
                .state('cheque', {
                    abstract: true,
                    url: "/cheques",
                    views: {
                        "header": {
                            controller:
                                ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
                                    $scope.selectedTab = $state.current.data.selectedTab;

                                    $rootScope.$on('$stateChangeSuccess',
                                        function(event, toState, toParams, fromState, fromParams) {
                                            $scope.selectedTab = toState.data.selectedTab;
                                        });
                                }],
                            template: '<header selected-tab="selectedTab"></header>'
                        },
                        "content": {
                            template: "<ui-view></ui-view>"
                        }
                    }
                })
                .state('cheque.filter', {
                    url: "^/filter",
                    template: "<filters-page></filters-page>",
                    data: {'selectedTab': 0}
                })
                .state('cheque.edit', {
                    url: "^/cheque/{chequeId:[0-9]{1,10}}",
                    controller:
                        ['$scope', '$stateParams', function($scope, $stateParams) {
                            $scope.chequeID = $stateParams.chequeId;
                        }],
                    template: '<cheque-page cheque-id="chequeID"></cheque-page>',
                    data: {'selectedTab': 1}
                })
                .state('cheque.create', {
                    url: "^/cheque",
                    template: '<cheque-page></cheque-page>',
                    data: {'selectedTab': 1}
                })
                .state('cheque.dashboard', {
                    url: "^/dashboard",
                    template: '<dashboard></dashboard>',
                    data: {'selectedTab': 2, 'access':['ROLE_ADMIN', 'ROLE_BOSS', 'ROLE_ENGINEER']}
                })
                .state('cheque.analytics', {
                    url: "^/analytics",
                    template: '<analytics-page></analytics-page>',
                    data: {'selectedTab': 3, 'access':['ROLE_ADMIN', 'ROLE_BOSS']}
                })
                .state('cheque.profile', {
                    url: "^/profile",
                    template: '<profile-page></profile-page>',
                    data: {'selectedTab': 4, 'access':['ROLE_ADMIN']}
                })
                .state('cheque.login', {
                    url: "^/login",
                    template: '<login-page></login-page>',
                    data: {'selectedTab': 5}
                })
                .state('cheque.photo', {
                    url: "^/photo/{photoID}",
                    controller:
                        ['$scope', '$stateParams', function($scope, $stateParams) {
                            $scope.photoID = $stateParams.photoID;
                        }],
                    template: '<photo-download photo-id="photoID"></photo-download>',
                    data: {'selectedTab': 1}
                });

            //$urlRouterProvider.when('', '/filter');
            $urlRouterProvider.otherwise('/filter');

            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }])
    .config(['$mdThemingProvider', function($mdThemingProvider){
            $mdThemingProvider
                .theme('default')
                .primaryPalette('grey', {'default':'900'})
                .accentPalette('blue-grey', {'default':'900'});

            $mdThemingProvider
                .theme('inner-block')
                .primaryPalette('grey', {'default':'50'});
    }])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 100;
    }])
    .config(['$mdDateLocaleProvider',
        function($mdDateLocaleProvider) {
            $mdDateLocaleProvider.months = 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_');
            $mdDateLocaleProvider.shortMonths = 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_');
            $mdDateLocaleProvider.days = 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_');
            $mdDateLocaleProvider.shortDays = 'вс_пн_вт_ср_чт_пт_сб'.split('_');
            // Change week display to start on Monday.
            $mdDateLocaleProvider.firstDayOfWeek = 1;
    }])
    .run(['gettextCatalog', 'amMoment', 'auth', 'security', '$document',
        function(gettextCatalog, amMoment, auth, security, $document){
            gettextCatalog.setCurrentLanguage('ru');
            amMoment.changeLocale('ru');
            auth.init();
            security.init();
    }]);