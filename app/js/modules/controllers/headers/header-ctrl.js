/**
 * Created by clicklabs on 25/8/16.
 */
App.controller('headerController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,$rootScope) {
        $rootScope.name = $cookieStore.get('name');
        $scope.logout = function(){
            $http
            ({
                url: Api.url + '/api/v1/customer/logout',
                method: "PUT",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                }
            }).success(function (response) {
                $state.go('app.login');
                $cookieStore.remove('obj');
                localStorage.clear();

            }).error(function (data) {
                $state.go('app.login');
                $cookieStore.remove('obj');
                localStorage.clear();
            });
        };
}]);