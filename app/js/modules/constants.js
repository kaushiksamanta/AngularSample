/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
App.constant("Api", {
    //"url": "http://40.76.50.210:3004" //beta
    //"url": "http://40.76.50.210:3003" //live
    "url": "http://40.76.50.210:3002" //test
    //"url": "http://40.76.50.210:3001" //devclient
    //"url": "http://40.76.50.210:3000" //dev
});

App
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  })
  .constant('APP_REQUIRES', {
    // jQuery based and standalone scripts
    scripts: {

       //load all css and js
       'otp':              ['app/css/otp.css'],
       'forgotPassword':['app/css/forgotpassword.css','app/js/modules/directives/intelInput.js'],
       'login':['app/css/login.css'],
       'signup':['app/css/signup.css',
           'app/js/modules/directives/intelInput.js'],
       'selectInstructor':['app/css/selectInstructor.css'],
       'editProfile':['app/css/editProfile.css'],
        'resetPassword':['app/css/resetPassword.css'],
        //load all jquery files
       'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                             'vendor/jquery-ui/ui/widget.js'],
       'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
        'bootstrap-multiselect': ['vendor/bootstrap-multiselect/bootstrap-multiselect.js',
                                'vendor/bootstrap-multiselect/bootstrap-multiselect.css']

    },
    // Angular based script (use the right module name)
    modules: [
      {name: 'ngDialog',                  files: ['bower_components/ng-dialog/js/ngDialog.js',
                                                 'bower_components/ng-dialog/css/ngDialog.css',
                                                 'bower_components/ng-dialog/css/ngDialog-theme-default.css'] }
    ]

  });