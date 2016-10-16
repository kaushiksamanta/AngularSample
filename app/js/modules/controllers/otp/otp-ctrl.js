App.controller('OtpController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {
        /*start loader*/
        $loading.start('otp');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('otp');
            },0);
        });

        $scope.phoneNumber = $state.params.phone.slice(-4);

        $scope.otp = {
            value_1:'',
            value_2:'',
            value_3:'',
            value_4:''
        };

        $scope.validate_otp = function(isValid){
            if(isValid){
                $loading.start('otp');
                $http
                ({
                    url: Api.url + '/api/v1/customer/verifyOTP',
                    method: "PUT",
                    data: {
                        "id": $state.params.id,
                        "OTPCode": $scope.otp.value_1+$scope.otp.value_2+$scope.otp.value_3+$scope.otp.value_4
                    }
                }).success(function (response) {
                    $loading.finish('otp');
                    console.log(response);
                    var dialog = ngDialog.open({
                        template: '<p>Registration Process Completed Successfully</p>',
                        plain: true
                    });
                    dialog.closePromise.then(function (data) {
                        $state.go('app.login');
                    });
                }).error(function (data) {
                    $loading.finish('otp');
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
            $loading.start('otp');
            $http
            ({
                url: Api.url + '/api/v1/customer/resendOTP',
                method: "PUT",
                data: {
                    "id": $state.params.id,
                    "language":'EN'
                }
            }).success(function (response) {
                $loading.finish('otp');
                ngDialog.open({
                    template: '<p>'+response.message+'</p>',
                    plain: true
                });
            }).error(function (data) {
                $loading.finish('otp');
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