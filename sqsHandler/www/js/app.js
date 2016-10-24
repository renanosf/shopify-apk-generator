// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','shopifyVars'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.views.maxCache(0);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.collection_one', {
    url: '/collection_one',
    views: {
      'tab-collection_one': {
        templateUrl: 'templates/tab-collection.html',
        controller: 'CollectionCtrl'
      }
    }
  })
  /* REMOVE IF COLLECTIONS > 2
  .state('tab.collection_two', {
      url: '/collection_two',
      views: {
        'tab-collection_two': {
          templateUrl: 'templates/tab-collection.html',
          controller: 'CollectionCtrl'
        }
      }
    })
  REMOVE IF COLLECTIONS > 2 */
  /* REMOVE IF COLLECTIONS > 3
  .state('tab.collection_three', {
    url: '/collection_three',
    views: {
      'tab-collection_three': {
        templateUrl: 'templates/tab-collection.html',
        controller: 'CollectionCtrl'
      }
    }
  })
  REMOVE IF COLLECTIONS > 3 */
  /* REMOVE IF COLLECTIONS > 4
  .state('tab.collection_four', {
    url: '/collection_four',
    views: {
      'tab-collection_four': {
        templateUrl: 'templates/tab-collection.html',
        controller: 'CollectionCtrl'
      }
    }
  })
  REMOVE IF COLLECTIONS > 4 */

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/collection_one');

});