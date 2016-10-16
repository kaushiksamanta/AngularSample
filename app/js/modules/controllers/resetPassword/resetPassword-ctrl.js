App.controller('resetPasswordController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {

        /*start loader*/
        $loading.start('resetPassword');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('resetPassword');
            },0);
        });

        $scope.user = {
            confirmpassword:'',
            password:''
        };

        $scope.resetPassword = function(isValid){
            if(isValid){
                $loading.start('resetPassword');
                $http
                ({
                    url: Api.url + '/api/v1/customer/resetPassword',
                    method: "POST",
                    data: {
                        "_id": $state.params.id,
                        "newPassword": $scope.user.password,
                        "confirmPassword":$scope.user.confirmpassword
                    }
                }).success(function (response) {
                    $loading.finish('resetPassword');
                    var dialog = ngDialog.open({
                        template: '<p>'+response.message+'</p>',
                        plain: true
                    });
                    dialog.closePromise.then(function (data) {
                        $state.go('app.login');
                    });
                }).error(function (data) {
                    $loading.finish('resetPassword');
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        console.log(data);
                    }
                });
            }
        };
    }]);