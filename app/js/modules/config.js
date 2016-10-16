/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';

  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // defaults to dashboard
  $urlRouterProvider.otherwise('/app/login');

  //
  // Application Routes
  // -----------------------------------
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController'
    })
    .state('app.signup', {
        url: '/signup',
        title: 'signup',
        controller:'SignupController',
        templateUrl: helper.basepath('signup.html'),
        resolve: helper.resolveFor('signup','bootstrap-multiselect','ngDialog')
    })
    .state('app.login', {
      url: '/login',
      title: 'login',
      controller:'LoginController',
      templateUrl: helper.basepath('login.html'),
      resolve: helper.resolveFor('login','ngDialog')
    })
    .state('app.forgotpassword', {
      url: '/forgotpassword',
      title: 'forgotpassword',
      controller:'ForgotPasswordController',
      templateUrl: helper.basepath('forgotpassword.html'),
      resolve: helper.resolveFor('forgotPassword','ngDialog')
    })
    .state('app.otp', {
      url: '/otp/:id/:phone',
      title: 'otp',
      controller:'OtpController',
      templateUrl: helper.basepath('otp.html'),
      resolve: helper.resolveFor('otp','ngDialog')
    })
  .state('app.forgotPasswordOtp', {
      url: '/forgotPasswordOtp/:phoneNumber/:countryCode/:id',
      title: 'forgotPasswordOtp',
      controller:'forgotPasswordOtpController',
      templateUrl: helper.basepath('forgotPasswordOtp.html'),
      resolve: helper.resolveFor('otp','ngDialog')
  })
  .state('app.resetPassword', {
      url: '/resetPassword/:id',
      title: 'resetPassword',
      controller:'resetPasswordController',
      templateUrl: helper.basepath('resetPassword.html'),
      resolve: helper.resolveFor('resetPassword','ngDialog')
  })
    .state('customer', {
      url: '/customer',
      abstract: true,
      controller: 'AppController',
      templateUrl: 'app/customer/app.html'
    })
    .state('customer.profile', {
      url: '/profile',
      title: 'profile',
      controller:'editProfileController',
      templateUrl: 'app/customer/profile.html',
      resolve: helper.resolveFor('editProfile','ngDialog','bootstrap-multiselect')
    })
  .state('customer.verifyotp', {
      url: '/verifyotp/:id/:phone',
      title: 'verifyotp',
      controller:'verifyOtpController',
      templateUrl: 'app/customer/verifyotp.html',
      resolve: helper.resolveFor('otp','ngDialog')
  })
    .state('customer.selectInstructor', {
      url: '/selectInstructor',
      title: 'Select Instructor',
      controller:'profileController',
      templateUrl: 'app/customer/selectInstructor.html',
      resolve: helper.resolveFor('selectInstructor')
    })

    //
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // -----------------------------------
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;


}]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
      'use strict';
      // registering components after bootstrap
      App.controller = $controllerProvider.register;
      App.directive  = $compileProvider.directive;
      App.filter     = $filterProvider.register;
      App.factory    = $provide.factory;
      App.service    = $provide.service;
      App.constant   = $provide.constant;
      App.value      = $provide.value;

}]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

    tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

    // tmhDynamicLocaleProvider.useStorage('$cookieStore');

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
  }]);
