(function () {
    'use strict';

    angular.module('widgets')
        .directive('svWeather', function (WeatherServ) {

            return {
                templateUrl: 'scripts/widgets/directives/sv-weather.html',
                scope: {},
                link: function ($scope, element, attr) {
                    //$scope.weatherReady = false;
                    //var weatherObj = WeatherServ.getWeatherObj();
                    //$scope.weather = weatherObj;
                    ////weatherObj.$bindTo($scope, 'weather')
                    //weatherObj.$loaded().then(function (w) {
                    //    $scope.weatherReady = true;
                    //})
                    //var day = new Date();
                    //day.setDate(day.getDate() + 2);
                    //$scope.dayAfterTomorrow = day;
                }
            };
        });
})();
