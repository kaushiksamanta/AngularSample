App.controller('ForgotPasswordController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {

        /*start loader*/
        $loading.start('forgot');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('forgot');
            },0);
        });

        $scope.initializeIntelInput = function () {
            $timeout(function () {
                var phoneNumberGlobal = false;

                $("#phone").intlTelInput();

                $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                    $("#phone").intlTelInput("setCountry", resp.country);
                });
                $("#phone").on('keypress keyup blur',function(event){
                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
                    var len = this.value.length;
                    if(len<5){
                        $("#phoneError").html("Phone number length must be at least 5 digits");
                        phoneNumberGlobal = false;
                    }
                    if(len>=5){
                        $(".phoneError").html("");
                        phoneNumberGlobal = false;
                    }
                    if(len==0){
                        $("#phoneError").html("Phone number is required");
                        phoneNumberGlobal = false;
                    }
                });
            },200);
        };
        $scope.initializeIntelInput();

        $scope.phone={};

        $scope.forgot = function(){
            $scope.user = {
                phoneNumber: $("#phone").val(),
                countryCode:'+'+$("#phone").intlTelInput("getSelectedCountryData").dialCode,
                language: "EN"
            };
            if(!jQuery.isEmptyObject($scope.user)){
                $loading.start('forgot');
                $http
                ({
                    url: Api.url + '/api/v1/customer/forgetPassword',
                    method: "POST",
                    data: $scope.user
                }).success(function (response) {
                    $loading.finish('forgot');
                    console.log(response);
                    $state.go("app.forgotPasswordOtp",{
                        phoneNumber:$scope.user.phoneNumber,
                        countryCode:$scope.user.countryCode,
                        id:response.data._id
                    });
                }).error(function (data) {
                    $loading.finish('forgot');
                    ngDialog.open({
                        template: "<p>"+data.message+"</p>",
                        plain: true
                    });
                });
            }
        };
    }]);
