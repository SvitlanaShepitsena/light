(function () {
    'use strict';

    angular.module('common')
        .directive('svArticleThumbSecond', function () {
            return {
                templateUrl: 'scripts/common/article/directives/sv-article-thumb-second.html',
                scope: {
                    id:'@',
                    title: '@',
                    img: '@'
                },
                link: function ($scope, element, attr) {
                }
            };
        });
})();
