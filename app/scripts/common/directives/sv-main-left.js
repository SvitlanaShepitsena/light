(function () {
    'use strict';

    angular.module('common')
        .directive('svMainLeft', function () {
            return {
                replace: true,
                templateUrl: 'scripts/common/directives/sv-main-left.html',
                link: function ($scope, element, attr) {

                }
            };
        });
})();
