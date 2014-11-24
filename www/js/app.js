// Cancer Spot App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('csApp', ['ionic', 'csApp.controllers', 'csApp.services', 'firebase'])

.run(function($ionicPlatform, $rootScope, $state, userSession, $firebase) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      }    
  });

   $rootScope.$on('$firebaseAuth', function(event, user) {
    



    // userSession.user = user;
    
    // var id = userSession.user.id;
    // var ref = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id);
    // var sync = $firebase(ref);
    // $rootScope.userId = id;
    // console.log("logged in, userId", $rootScope.userId);
    // var csRef = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id + "/csUser"); 
    // var csSync = $firebase(csRef);
    

      
   });

   $rootScope.$on('$firebaseSimpleLogin:error', function(event, error) {
        console.log('Error logging user in: ', error);
   });

   $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {
         $state.go('login');
   });
})



// ALL THE ROUTES

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    
    .state('login',{
        url:'/login',
        templateUrl:'js/login/login.html',
        controller:'loginCtrl'
    })

    // CREATE USER
    .state('fss',{
        url:'/login/fss',
        templateUrl:'js/login/fss.html',
        controller:'fssCtrl'
    })

    .state('fighterCreate',{
        url:'/login/fighterCreate',
        templateUrl:'js/login/fighterCreate.html',
        controller:'fssCtrl'
    })

    // .state('survivorCreate',{
    //     url:'/login/survivorCreate',
    //     templateUrl:'js/login/survivorCreate.html',
    //     controller:'loginCtrl'
    // })

    // .state('supporterCreate',{
    //     url:'/login/supporterCreate',
    //     templateUrl:'js/login/supporterCreate.html',
    //     controller:'loginCtrl'
    // })

    .state('profile', {
          url: '/profile',
          templateUrl: 'js/profile/profile.html',
          controller: 'profileCtrl'
    })
    .state('friend-detail', {
        url: '/friend-detail/:id',
        templateUrl: 'templates/friend-detail.html',
        controller: 'friendDetailCtrl'
          
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.explore', {
      url: '/explore',
      views: {
        'tab-explore': {
          templateUrl: 'js/explore/tab-explore.html',
          controller: 'exploreCtrl'
        }
      }
    })
    
    .state('tab.connections', {
      url: '/connections',
      views: {
        'tab-connections': {
          templateUrl: 'js/connections/tab-connections.html',
          controller: 'connectionsCtrl'
        }
      }
    })
    .state('tab.messages', {
      url: '/messages',
      views: {
        'tab-messages': {
          templateUrl: 'js/messaging/tab-messages.html',
          controller: 'messagesCtrl'
        }
      }
    })
    .state('chat', {
      url: '/chat/:cid',
      templateUrl: 'js/messaging/chat.html',
      controller: 'chatCtrl'
    })
    .state('tab.floor', {
      url: '/floor',
      views: {
        'tab-floor': {
          templateUrl: 'js/floor/tab-floor.html',
          controller: 'profileCtrl'
        }
      }
    })
    .state('tab.more', {
      url: '/more',
      views: {
        'tab-more': {
          templateUrl: 'js/more/tab-more.html',
          controller: 'moreCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});
