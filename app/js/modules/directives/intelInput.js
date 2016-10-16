App.directive('intelInput', [function() {
    return {
        restrict: 'A',
        scope: {
            'model': '='
        },
        link: function(scope, elem, attrs) {
            $(elem).intlTelInput();
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                $(elem).intlTelInput("setCountry", resp.country);
            });
            $(elem).keypress(function(event){
                scope.$apply(function(){
                    if(event.which != 8 && isNaN(String.fromCharCode(event.which))){
                        event.preventDefault();
                    }
                    if($(elem).val().length<10){
                        $($('.intl-tel-input.allow-dropdown').next()).html("Phone number length must be less than 10 digits");
                    }
                    if($(elem).val().length==10){
                        $($('.intl-tel-input.allow-dropdown').next()).html("");
                    }
                    if($(elem).val().length==0){
                        $($('.intl-tel-input.allow-dropdown').next()).html("Phone number is required");
                    }
                    scope.model = {
                        number:$(elem).val(),
                        code:'+'+$(elem).intlTelInput("getSelectedCountryData").dialCode
                    };
                });
            });
        }
    };
}]);