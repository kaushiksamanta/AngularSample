App.controller('SignupController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {
        /*start loader*/
        $loading.start('signup');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('signup');
            },0);
        });

        $scope.changeCss = function(){
          $timeout(function(){
              $('.multiselect.dropdown-toggle.btn.btn-default').css({
                  width: "100%",
                  overflow: "hidden",
                  "text-overflow": "ellipsis",
                  height: "41px",
                  "border-radius": "8px",
                  background: "#cccccc",
                  border: "none",
                  color:"#333946"
              });
              $('.dropdown-menu').css({
                  width:"100%"
              });
          });
        };

        /*intel input*/
        $scope.initializeIntelInput = function () {
            $timeout(function () {
                var phoneNumberGlobal = false;

                $(".phone").intlTelInput();

                $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                    $(".phone").intlTelInput("setCountry", resp.country);
                });
                $(".phone").on('keypress keyup blur',function(event){
                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
                    var len = this.value.length;
                    if(len<5){
                        $(".phoneError").html("Phone number length must be at least 5 digits");
                        phoneNumberGlobal = false;
                    }
                    if(len>=5){
                        $(".phoneError").html("");
                        phoneNumberGlobal = false;
                    }
                    if(len==0){
                        $(".phoneError").html("Phone number is required");
                        phoneNumberGlobal = false;
                    }
                });
            },200);
        };
        $scope.initializeIntelInput();

        $scope.tab = {
            indivisual:true,
            corporate:false
        };

        $scope.indivisual = {
            firstName:'',
            lastName:'',
            email:'',
            billingAddress:'',
            state:'',
            city:'',
            postalCode:'',
            password:'',
            phone:'',
            country:'',
            agreementYes:true,
            agreementNo:false
        };

        $scope.corporate = {
            firstName:'',
            lastName:'',
            email:'',
            billingAddress:'',
            state:'',
            city:'',
            postalCode:'',
            companyName:'',
            companyCenters:'',
            companyId:'',
            sportLicense:'',
            password:'',
            type:'',
            country:'',
            sportLicenseType:'',
            agreementYes:true,
            agreementNo:false,
            sportLicenseOption:[]
        };

        $scope.initializeCorporateAuto = function(){
            $timeout(function(){
                $scope.autocompleteCorp = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */ (document.getElementById('autocompleteCorp')), {
                        types: ['geocode']
                    });
                google.maps.event.addListener($scope.autocompleteCorp, 'place_changed', function () {
                    // Get the place details from the autocomplete object.
                    $timeout(function(){
                        var place = $scope.autocompleteCorp.getPlace();
                        $scope.corporate.billingAddress = place.formatted_address;
                        for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
                            switch (addressType){
                                case 'locality':
                                    $scope.corporate.city = place.address_components[i].long_name;
                                    break;
                                case 'administrative_area_level_1':
                                    $scope.corporate.state = place.address_components[i].long_name;
                                    break;
                                case 'postal_code':
                                    $scope.corporate.postalCode = place.address_components[i].long_name;
                                    break;
                                case 'country':
                                    $scope.corporate.country = place.address_components[i].long_name;
                                    break;
                            }
                        }
                    });
                });
            },500);
        };

        $scope.initializeIndivisulaAuto = function(){
            $timeout(function(){
                $scope.autocompleteInd = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */ (document.getElementById('autocompleteIndi')), {
                        types: ['geocode']
                    });
                google.maps.event.addListener($scope.autocompleteInd, 'place_changed', function () {
                    // Get the place details from the autocomplete object.
                    $timeout(function(){
                        var place = $scope.autocompleteInd.getPlace();
                        $scope.indivisual.billingAddress = place.formatted_address;
                        for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
                            switch (addressType){
                                case 'locality':
                                    $scope.indivisual.city = place.address_components[i].long_name;
                                    break;
                                case 'administrative_area_level_1':
                                    $scope.indivisual.state = place.address_components[i].long_name;
                                    break;
                                case 'postal_code':
                                    $scope.indivisual.postalCode = place.address_components[i].long_name;
                                    break;
                                case 'country':
                                    $scope.indivisual.country = place.address_components[i].long_name;
                                    break;
                            }
                        }
                    });
                });
            },500);
        };

        $scope.initializeIndivisulaAuto();

        $scope.getSportType = function(){
            $http
            ({
                url: Api.url + '/api/v1/admin/getSportType',
                method: "GET"
            }).success(function (response) {
                $timeout(function(){
                    $('#typeOfSport').multiselect({
                        buttonWidth: '100%'
                    });
                    var options = [];
                    response.data.forEach(function (column) {
                        options.push({
                            label: column.typeOfSport,
                            title: column.provider,
                            value: column._id
                        });
                    });
                    $('#typeOfSport').multiselect('dataprovider', options);
                });
                $scope.companysize();
                $scope.changeCss();
            }).error(function (data) {
                if(data.statusCode == 401){
                    $state.go('app.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    ngDialog.open({
                        template: "<p>"+data.message+"</p>",
                        plain: true
                    });
                }
            });
        };

        $scope.companysize = function(){
            $timeout(function(){
                $('#companySize').multiselect({
                    buttonWidth: '100%',
                    includeSelectAllOption: true
                });
                var Companyoptions = [
                    {label: '1-50', title: '1-50', value: '1-50'},
                    {label: '50-100', title: '50-100', value: '50-100'},
                    {label: '100-150', title: '100-150', value: '100-150'},
                    {label: '150-200', title: '150-200', value: '150-200'},
                    {label: '200-250', title: '200-250', value: '200-250'},
                    {label: '250-300', title: '250-300', value: '250-300'},
                    {label: '300-350', title: '300-350', value: '300-350'},
                    {label: '350-400', title: '350-400', value: '350-400'},
                    {label: '400-450', title: '400-450', value: '400-450'},
                    {label: '500+', title: '500+', value: '500+'}
                ];
                $('#companySize').multiselect('dataprovider', Companyoptions);
            });
        };

        $scope.agreementYes = function (value) {
            if(value){
                $scope.indivisual.agreementYes = true;
                $scope.indivisual.agreementNo = false;

                $scope.corporate.agreementYes = true;
                $scope.corporate.agreementNo = false;
            }else {
                $scope.indivisual.agreementYes = false;
                $scope.indivisual.agreementNo = true;

                $scope.corporate.agreementYes = false;
                $scope.corporate.agreementNo = true;
            }
        };

        $scope.agreementNo = function(value){
            if(value){
                $scope.indivisual.agreementYes = false;
                $scope.indivisual.agreementNo = true;

                $scope.corporate.agreementYes = false;
                $scope.corporate.agreementNo = true;
            }else {
                $scope.indivisual.agreementYes = true;
                $scope.indivisual.agreementNo = false;

                $scope.corporate.agreementYes = true;
                $scope.corporate.agreementNo = false;
            }
        };

        $scope.signup_indivisual = function (isValid) {
            if(isValid){
                var data = {
                    "firstName":$scope.indivisual.firstName,
                    "lastName":$scope.indivisual.lastName,
                    "email":$scope.indivisual.email,
                    "billingAddress":$scope.indivisual.billingAddress,
                    "state":$scope.indivisual.state,
                    "city":$scope.indivisual.city,
                    "zip":$scope.indivisual.postalCode,
                    "phoneNumber":$(".phone").val(),
                    "timezoneOffset":new Date().getTimezoneOffset(),
                    "timezone":jstz.determine().name(),
                    "userType":'individual',
                    "countryCode":'+'+$(".phone").intlTelInput("getSelectedCountryData").dialCode,
                    "password":$scope.indivisual.password,
                    "language":'EN',
                    "country":$scope.indivisual.country
                };
                $loading.start('signup');
                $http
                ({
                    url: Api.url + '/api/v1/customer/register',
                    method: "POST",
                    data:data
                }).success(function (response) {
                    $loading.finish('signup');
                    $state.go('app.otp',{id:response.data._id,phone:response.data.contact.number});

                }).error(function (data) {
                    $loading.finish('signup');
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        ngDialog.open({
                            template: "<p>"+data.message+"</p>",
                            plain: true
                        });
                    }
                });
            }
        };

        $scope.signup_corporate = function (isValid) {
            if(isValid){
                var corporate_data = {
                    "firstName":$scope.corporate.firstName,
                    "lastName":$scope.corporate.lastName,
                    "email":$scope.corporate.email,
                    "billingAddress":$scope.corporate.billingAddress,
                    "state":$scope.corporate.state,
                    "city":$scope.corporate.city,
                    "zip":$scope.corporate.postalCode,
                    "phoneNumber":$(".phone").val(),
                    "timezoneOffset":new Date().getTimezoneOffset(),
                    "timezone":jstz.determine().name(),
                    "countryCode":'+'+$(".phone").intlTelInput("getSelectedCountryData").dialCode,
                    "country":$scope.corporate.country,
                    "password":$scope.corporate.password,
                    "companyName":$scope.corporate.companyName,
                    "companyCenterNumbers":$scope.corporate.companyCenters,
                    "companySize":$('#companySize').val(),
                    "companyId":$scope.corporate.companyId,
                    "language":'EN'
                };
                if(!$scope.corporate.type){
                    $timeout(function(){
                        var typesport = [];
                        $('#typeOfSport option:selected').map(function(a, item){
                            typesport.push(item.value);
                        });
                        corporate_data.typeOfSport = typesport;
                    });
                    corporate_data.licenseNumber = $scope.corporate.sportLicense;
                    corporate_data.userType = 'corporateWithoutInhouse';
                }
                else{
                    corporate_data.userType = 'corporateWithInhouse';
                }
                $loading.start('signup');
                $timeout(function(){
                    $http
                    ({
                        url: Api.url + '/api/v1/customer/register',
                        method: "POST",
                        data:corporate_data
                    }).success(function (response) {
                        $loading.finish('signup');
                        $state.go('app.otp',{id:response.data._id,phone:response.data.contact.number});
                    }).error(function (data) {
                        $loading.finish('signup');
                        if(data.statusCode == 401){
                            $state.go('page.login');
                            $cookieStore.remove('obj');
                            localStorage.clear();
                        }
                        else {
                            ngDialog.open({
                                template: "<p>"+data.message+"</p>",
                                plain: true
                            });
                        }
                    });
                },100);
            }
        };

    }]);
