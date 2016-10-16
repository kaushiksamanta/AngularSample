App.controller('forgotPasswordOtpController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {

        /*start loader*/
        $loading.start('forgototp');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('forgototp');
            },0);
        });
        $scope.phoneNumber = $state.params.phoneNumber.slice(-4);
        $scope.phone={};
        $scope.validate_otp = function(isValid){
            if(isValid){
                $loading.start('forgototp');
                $http
                ({
                    url: Api.url + '/api/v1/customer/checkForgetPasswordOTP',
                    method: "POST",
                    data: {
                        "countryCode":$state.params.countryCode,
                        "phoneNumber":$state.params.phoneNumber,
                        "forgotPasswordCode": $scope.otp.value_1+$scope.otp.value_2+$scope.otp.value_3+$scope.otp.value_4
                    }
                }).success(function (response) {
                    $loading.finish('forgototp');
                    $scope.forgotID = response.data._id;
                    $state.go("app.resetPassword",{
                        id:response.data._id
                    });
                }).error(function (data) {
                    $loading.finish('forgototp');
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        ngDialog.open({
                            template: '<p>'+data.message+'</p>',
                            plain: true
                        });
                    }
                });
            }
        };

        $scope.resend = function(){
            $loading.start('forgototp');
            $http
            ({
                url: Api.url + '/api/v1/customer/forgetPassword',
                method: "PUT",
                data: {
                    "phoneNumber": $state.params.phoneNumber,
                    "countryCode": $state.params.countryCode,
                    "language": "EN"
                }
            }).success(function (response) {
                $loading.finish('forgototp');
                ngDialog.open({
                    template: '<p>'+response.message+'</p>',
                    plain: true
                });
            }).error(function (data) {
                $loading.finish('forgototp');
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    ngDialog.open({
                        template: '<p>'+data.message+'</p>',
                        plain: true
                    });
                }
            });
        };

    }]);
