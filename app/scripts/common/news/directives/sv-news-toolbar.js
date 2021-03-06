(function () {
    'use strict';

    angular.module('common')
        .directive('svNewsToolbar', function (NewsGeneratorServ, $rootScope) {
            return {
                replace: true,
                templateUrl: 'scripts/common/news/directives/sv-news-toolbar.html',
                scope: {
                    number: '=',
                    panelTitle: '@'
                },
                link: function ($scope, element, attr) {
                    $rootScope.$watch('allNews', function (newValue, oldValue) {
                        $scope.news = _.take(_.shuffle(_.rest(newValue, 3)), $scope.number);
                    });
                }
            };
        });
})();
