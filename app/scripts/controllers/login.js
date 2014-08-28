'use strict';

angular.module('fengshui')
    .controller('LoginCtrl', function ($scope, url, $firebaseSimpleLogin, $state, authService) {
        $scope.loginError = false;
        $scope.email = {data: 'admin@gmail.com'};
        $scope.pass = {data: '123456'};

        $scope.fenLogout = function () {
            $scope.auth.$logout();
                console.log('No current user');
        }
    });