App.controller('LoginController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {

        /*start loader*/
        $loading.start('login');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('login');
            },0);
        });

        $scope.user = {
            email:'',
            password:''
        };

        $scope.login = function(isValid){
            if(isValid){
                $loading.start('login');
                $http
                ({
                    url: Api.url + '/api/v1/customer/login',
                    method: "POST",
                    data: {
                        "email": $scope.user.email,
                        "password": $scope.user.password,
                        "language":'EN'
                    }
                }).success(function (response) {
                    $loading.finish('login');
                    var someSessionObj = response.data.accessToken;
                    $cookieStore.put('obj', someSessionObj);
                    $cookieStore.put('name',response.data.firstName);
                    if(response.data.contact.isVerified == false){
                        $state.go('customer.verifyotp',{id:response.data._id,phone:response.data.contact.number});
                    }
                    else {
                        $state.go('customer.profile');
                    }
                }).error(function (data) {
                    $loading.finish('login');
                    ngDialog.open({
                        template: '<p>'+data.message+'</p>',
                        plain: true
                    });
                });
            }
        };
}]);