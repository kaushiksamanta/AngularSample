App.controller('editProfileController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','ngDialog',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,ngDialog) {
        /*start loader*/
        $loading.start('profile');
        /*stop loader after page is loaded */
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                $loading.finish('profile');
            },0);
        });

        $scope.name = $cookieStore.get('name');
        $scope.tab = {
            indivisual:false,
            corporateWithoutInhouse:true,
            corporateWithInhouse:true
        };

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

        $scope.file_to_upload = function (File,name) {
            var file = File[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                document.getElementById("uploadFile").value = null;
                var dialog = ngDialog.open({
                    template: "<p>"+'Please upload only image files'+"</p>",
                    plain: true
                });
                return;
            }
            else {
                $scope.FileUploaded = File[0];
                var img = document.getElementById(name);
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
                $scope.imgUpd();
            }
        };

        $scope.imgUpd = function () {
            var formData = new FormData();
            if(typeof $scope.FileUploaded != 'undefined'){
                formData.append('profilePicture',$scope.FileUploaded);
            }
            $http
            ({
                url: Api.url + '/api/v1/customer/profileImageUpload',
                method: "PUT",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj'),
                    'Content-Type': undefined
                },
                data:formData
            }).success(function (response) {
                $loading.finish('profile');
                ngDialog.open({
                    template: "<p>"+'Profile Image uploaded successfully'+"</p>",
                    plain: true
                });

            }).error(function (data) {
                $loading.finish('profile');
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

        $scope.indivisual = {
            firstName:'',
            lastName:'',
            billingAddress:'',
            state:'',
            city:'',
            postalCode:'',
            country:'',
            countryCode:''
        };

        $scope.corporate = {
            firstName:'',
            lastName:'',
            billingAddress:'',
            state:'',
            city:'',
            countryCode:'',
            postalCode:'',
            country:'',
            companyName:'',
            companyCenters:'',
            companySize:'',
            companyId:'',
            sportLicense:'',
            sportLicenseType:[]
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

        $scope.subUserArray = [];
        $scope.newSubUserArray = [];

        $scope.getProfileData = function () {
            $http({
                url: Api.url + '/api/v1/customer/getMyProfile',
                method: "GET",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                }
            }).success(function(success){
                console.log(success);
                if(success.data.contact.isVerified == false){
                    $state.go('customer.verifyotp',{id:success.data._id,phone:success.data.contact.number});
                }
                else {
                    $scope.profilePhoto = success.data.profilePicture.original;
                    switch(success.data.category){
                        case "individual":
                            localStorage.setItem("indivisualProfileData",JSON.stringify(success.data));
                            $scope.indivisual = {
                                firstName:success.data.firstName,
                                lastName:success.data.lastName,
                                billingAddress:success.data.address.billing,
                                state:success.data.address.state,
                                city:success.data.address.city,
                                postalCode:success.data.address.zip,
                                country:success.data.address.country,
                                contact:success.data.contact.number,
                                countryCode:success.data.countryCode,
                                photo:success.data.profilePicture.original
                            };
                            $scope.tab = {
                                indivisual:true,
                                corporateWithoutInhouse:false,
                                corporateWithInhouse:false
                            };
                            $timeout(function(){
                                $(".phone").val(success.data.contact.number);
                            });
                            $scope.initializeIntelInput();
                            $scope.initializeIndivisulaAuto();
                            $loading.finish('profile');
                            break;
                        case "corporateWithInhouse":
                            localStorage.setItem("corporateData",JSON.stringify(success.data));
                            $scope.corporate = {
                                firstName:success.data.firstName,
                                lastName:success.data.lastName,
                                billingAddress:success.data.address.billing,
                                state:success.data.address.state,
                                city:success.data.address.city,
                                postalCode:success.data.address.zip,
                                country:success.data.address.country,
                                companyName:success.data.companyName,
                                companyCenters:success.data.companyCenterNumbers,
                                companySize:success.data.companySize,
                                companyId:success.data.companyId,
                                contact:success.data.contact.number,
                                countryCode:success.data.countryCode
                            };
                            $scope.tab = {
                                indivisual:false,
                                corporateWithoutInhouse:true,
                                corporateWithInhouse:false
                            };
                            $scope.corporate.subUsersLength = success.data.subUsers;
                            $scope.corporate.subUsersLength.forEach(function (col) {
                                $scope.subUserArray.push({
                                    "subUserName": col.name,
                                    "subUserEmail": col.email,
                                    "subUserContact": col.contact,
                                    "subUserCountryCode": col.countryCode,
                                    "subUserAddress": col.address
                                });
                            });
                            $timeout(function(){
                                $(".phone").val(success.data.contact.number);
                            });
                            $scope.initializeIntelInput();
                            $scope.initializeCorporateAuto();
                            $loading.finish('profile');
                            break;
                        case "corporateWithoutInhouse":
                            localStorage.setItem("corporateData",JSON.stringify(success.data));
                            $scope.sportLicenseModal = success.data.typeOfSport;
                            $scope.corporate = {
                                firstName:success.data.firstName,
                                lastName:success.data.lastName,
                                billingAddress:success.data.address.billing,
                                state:success.data.address.state,
                                city:success.data.address.city,
                                postalCode:success.data.address.zip,
                                country:success.data.address.country,
                                companyName:success.data.companyName,
                                companyCenters:success.data.companyCenterNumbers,
                                companySize:success.data.companySize,
                                companyId:success.data.companyId,
                                sportLicense:success.data.licenseNumber,
                                contact:success.data.contact.number,
                                sportLicenseType:success.data.typeOfSport,
                                countryCode:success.data.countryCode
                            };
                            $scope.tab = {
                                indivisual:false,
                                corporateWithoutInhouse:true,
                                corporateWithInhouse:true
                            };
                            $scope.corporate.subUsersLength = success.data.subUsers;
                            $scope.corporate.subUsersLength.forEach(function (col) {
                                $scope.subUserArray.push({
                                    "subUserName": col.name,
                                    "subUserEmail": col.email,
                                    "subUserContact": col.contact,
                                    "subUserCountryCode": col.countryCode,
                                    "subUserAddress": col.address
                                });
                            });
                            $timeout(function(){
                                $(".phone").val(success.data.contact.number);
                            });
                            $scope.initializeIntelInput();
                            $scope.initializeCorporateAuto();
                            $loading.finish('profile');
                            break;
                    }
                    $timeout(function(){
                        $(".subuserPhones").intlTelInput();
                        $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                            $(".subuserPhones").intlTelInput("setCountry", resp.country);
                        });
                    },200);
                    $scope.getSportType();
                    $scope.companysize();
                    $scope.changeCss();
                }
            }).error(function(data){
                $loading.finish('profile');
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
                    console.log(data);
                }
            });
        };
        $scope.getProfileData();

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
                    var sportType = [];
                    response.data.forEach(function(column){
                        sportType.push({
                            label: column.typeOfSport,
                            title: column.typeOfSport,
                            value: column._id
                        });
                    });
                    $scope.sportLicenseModal.forEach(function(column){
                        sportType.forEach(function (col,index) {
                            if(column._id == col.value){
                                sportType[index].selected = true;
                            }
                        });
                    });
                    $('#typeOfSport').multiselect('dataprovider', sportType);
                });
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
                Companyoptions.forEach(function(col,index){
                    if(col.value == $scope.corporate.companySize){
                        Companyoptions[index].selected = true;
                    }
                });
                $('#companySize').multiselect('dataprovider', Companyoptions);
            });
        };

        $scope.addSubUserDialog = function () {
            $timeout(function () {
                var SubphoneNumberGlobal = false;
                $("#subphone").intlTelInput();

                $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                    $("#subphone").intlTelInput("setCountry", resp.country);
                });

                $("#subphone").on('keypress keyup blur',function(event){
                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
                    var len = this.value.length;
                    if(len<10){
                        $(".subphoneError").html("Phone number length must be less than 10 digits");
                        SubphoneNumberGlobal = false;
                    }
                    if(len==10){
                        $(".subphoneError").html("");
                        SubphoneNumberGlobal = true;
                    }
                    if(len==0){
                        $(".subphoneError").html("Phone number is required");
                        SubphoneNumberGlobal = false;
                    }
                });
            },1000);
            $scope.subuser = {
                Name:'',
                email:'',
                Address:''
            };
             var dialog = ngDialog.open({
                template: 'addSubUsers',
                className: 'ngdialog-theme-default dialogwidth50',
                closeByNavigation:true,
                scope: $scope
            });
            dialog.closePromise.then(function (data) {
                $timeout(function(){
                    $(".subuserPhones").intlTelInput();
                    $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                        $(".subuserPhones").intlTelInput("setCountry", resp.country);
                    });
                },200);
            });
            $scope.addSubuser = function(isValid){
                if(isValid){
                    if($scope.corporate.subUsersLength.length>0){
                        $scope.newSubUserArray.push({
                            "subUserName": $scope.subuser.Name,
                            "subUserEmail": $scope.subuser.email,
                            "subUserContact": $("#subphone").val(),
                            "subUserCountryCode": '+'+$("#subphone").intlTelInput("getSelectedCountryData").dialCode,
                            "subUserAddress": $scope.subuser.Address
                        });
                        $scope.subUserArray.push({
                            "subUserName": $scope.subuser.Name,
                            "subUserEmail": $scope.subuser.email,
                            "subUserContact": $("#subphone").val(),
                            "subUserCountryCode": '+'+$("#subphone").intlTelInput("getSelectedCountryData").dialCode,
                            "subUserAddress": $scope.subuser.Address
                        });
                    }
                    else {
                        $scope.subUserArray.push({
                            "subUserName": $scope.subuser.Name,
                            "subUserEmail": $scope.subuser.email,
                            "subUserContact": $("#subphone").val(),
                            "subUserCountryCode": '+'+$("#subphone").intlTelInput("getSelectedCountryData").dialCode,
                            "subUserAddress": $scope.subuser.Address
                        });
                    }
                    ngDialog.close({
                        template: 'addSubUsers',
                        className: 'ngdialog-theme-default dialogwidth50',
                        closeByNavigation:true,
                        scope: $scope
                    });
                }
            };
        };

        $scope.update_indivisual = function () {
            var globalIndivisual = 0;
            var oldData = JSON.parse(localStorage.getItem("indivisualProfileData"));
            var data = {
                "language":'EN'
            };
            if(oldData.firstName != $scope.indivisual.firstName){
                data.firstName = $scope.indivisual.firstName;
                globalIndivisual++;
            }
            if(oldData.lastName != $scope.indivisual.lastName){
                data.lastName = $scope.indivisual.lastName;
                globalIndivisual++;
            }
            if(oldData.address.billing != $scope.indivisual.billingAddress){
                data.billingAddress = $scope.indivisual.billingAddress;
                globalIndivisual++;
            }
            if(oldData.address.state != $scope.indivisual.state){
                data.state = $scope.indivisual.state;
                globalIndivisual++;
            }
            if(oldData.address.city != $scope.indivisual.city){
                data.city = $scope.indivisual.city;
                globalIndivisual++;
            }
            if(oldData.address.zip != $scope.indivisual.postalCode){
                data.zip = $scope.indivisual.postalCode;
                globalIndivisual++;
            }
            if(oldData.address.country != $scope.indivisual.country){
                data.country = $scope.indivisual.country;
                globalIndivisual++;
            }
            if(oldData.countryCode != '+'+$(".phone").intlTelInput("getSelectedCountryData").dialCode){
                data.countryCode = '+'+$(".phone").intlTelInput("getSelectedCountryData").dialCode;
                globalIndivisual++;
            }
            if(oldData.contact.number!=$(".phone").val()){
                data.phoneNumber = $(".phone").val();
                globalIndivisual++;
            }
            if(globalIndivisual>0){
                $loading.start('profile');
                $http
                ({
                    url: Api.url + '/api/v1/customer/editProfile',
                    method: "PUT",
                    headers: {
                        'authorization': 'bearer' + " " + $cookieStore.get('obj')
                    },
                    data:data
                }).success(function (response) {
                    $loading.finish('profile');
                    if(response.message=='Please Verify OTP'){
                        var dialog = ngDialog.open({
                            template: "<p>"+response.message+"</p>",
                            plain: true
                        });
                        dialog.closePromise.then(function () {
                            if(response.message == 'Please Verify OTP'){
                                $state.go('customer.verifyotp',{id:response.data._id,phone:response.data.contact.number});
                            }
                            else {
                                $state.reload();
                            }
                        });
                    }
                    else {
                        var dialog = ngDialog.open({
                            template: "<p>"+"Profile Edited Successfully"+"</p>",
                            plain: true
                        });
                        dialog.closePromise.then(function () {
                            $state.reload();
                        });
                    }
                    console.log(response);

                }).error(function (data) {
                    $loading.finish('profile');
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
                        console.log(data);
                    }
                });
            }
        };

        $scope.update_corporate = function () {
            var global_corporate = 0;
            var oldCorporateData = JSON.parse(localStorage.getItem("corporateData"));
            var corporate_data = {
                "language":'EN'
            };
            $timeout(function(){
                var typesport = [];
                $('#typeOfSport option:selected').map(function(a, item){
                    typesport.push(item.value);
                });
                if(oldCorporateData.typeOfSport.length != typesport.length){
                    if(typesport.length!=0){
                        corporate_data.typeOfSport = typesport;
                        global_corporate++;
                    }
                }
                if(oldCorporateData.companySize != $('#companySize').val()){
                    corporate_data.companySize = $('#companySize').val();
                    global_corporate++;
                }
                if(oldCorporateData.firstName != $scope.corporate.firstName){
                    corporate_data.firstName = $scope.corporate.firstName;
                    global_corporate++;
                }
                if(oldCorporateData.lastName != $scope.corporate.lastName){
                    corporate_data.lastName = $scope.corporate.lastName;
                    global_corporate++;
                }
                if(oldCorporateData.address.billing != $scope.corporate.billingAddress){
                    corporate_data.billingAddress = $scope.corporate.billingAddress;
                    global_corporate++;
                }
                if(oldCorporateData.address.state != $scope.corporate.state){
                    corporate_data.state = $scope.corporate.state;
                    global_corporate++;
                }
                if(oldCorporateData.address.city != $scope.corporate.city){
                    corporate_data.city = $scope.corporate.city;
                    global_corporate++;
                }
                if(oldCorporateData.address.zip != $scope.corporate.postalCode){
                    corporate_data.zip = $scope.corporate.postalCode;
                    global_corporate++;
                }
                if(oldCorporateData.address.country != $scope.corporate.country){
                    corporate_data.country = $scope.corporate.country;
                    global_corporate++;
                }
                if(oldCorporateData.companyName != $scope.corporate.companyName){
                    corporate_data.companyName = $scope.corporate.companyName;
                    global_corporate++;
                }
                if(oldCorporateData.companyCenterNumbers != $scope.corporate.companyCenters){
                    corporate_data.companyCenterNumbers = $scope.corporate.companyCenters;
                    global_corporate++;
                }
                if(oldCorporateData.companyId != $scope.corporate.companyId){
                    corporate_data.companyId = $scope.corporate.companyId;
                    global_corporate++;
                }
                if(oldCorporateData.countryCode != '+'+$(".phone").intlTelInput("getSelectedCountryData").dialCode){
                    corporate_data.countryCode = '+'+$(".phone").intlTelInput("getSelectedCountryData").dialCode;
                    global_corporate++;
                }
                if(oldCorporateData.contact.number!=$(".phone").val()){
                    corporate_data.phoneNumber = $(".phone").val();
                    global_corporate++;
                }
                if(oldCorporateData.licenseNumber != $scope.corporate.sportLicense)
                {
                    corporate_data.licenseNumber = $scope.corporate.sportLicense;
                    global_corporate++;
                }
                if($scope.corporate.subUsersLength.length>0){
                    if($scope.newSubUserArray.length!=0){
                        corporate_data.subUsers = $scope.newSubUserArray;
                        global_corporate++;
                    }
                }
                else {
                    if(oldCorporateData.subUsers.length != $scope.subUserArray.length){
                        corporate_data.subUsers = $scope.subUserArray;
                        global_corporate++;
                    }
                }
                if(global_corporate>0){
                    $loading.start('profile');
                    $http
                    ({
                        url: Api.url + '/api/v1/customer/editProfile',
                        method: "PUT",
                        headers: {
                            'authorization': 'bearer' + " " + $cookieStore.get('obj')
                        },
                        data:corporate_data
                    }).success(function (response) {
                        $loading.finish('profile');
                        var dialog = ngDialog.open({
                            template: "<p>"+'Profile Updated Successfully'+"</p>",
                            plain: true
                        });
                        dialog.closePromise.then(function (data) {
                            if(response.message == 'Please Verify OTP'){
                                $state.go('customer.verifyotp',{id:response.data._id,phone:response.data.contact.number});
                            }
                            else {
                                $state.reload();
                            }
                        });
                    }).error(function (data) {
                        $loading.finish('profile');
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
                            console.log(data);
                        }
                    });
                }
            });
        };

        $scope.submit = function () {
            switch (true){
                case $scope.tab.indivisual == true && $scope.tab.corporateWithoutInhouse == false:
                    $scope.update_indivisual();
                    break;
                case $scope.tab.indivisual == false && $scope.tab.corporateWithoutInhouse == true:
                    $scope.update_corporate();
                    break;
            }
        };

    }]);
