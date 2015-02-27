'use strict';

angular.module('auth')
  .controller('Login', function ($scope, url, $firebaseSimpleLogin, $state) {
        $scope.loginError = false;
        $scope.email = {data: 'admin@gmail.com'};
        $scope.pass = {data: '123456'};

        $scope.fenLogout = function () {
            $scope.authObj.$logout();
                console.log('No current user');
        };
    });