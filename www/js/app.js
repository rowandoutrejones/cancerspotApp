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
    var ref = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id);
    var sync = $firebase(ref);
    
    var authData = ref.getAuth();
    $rootScope.authData = authData;
    
    var id = authData.user.id;
    $rootScope.userId = id;

    console.log("logged in, userId", $rootScope.userId);
    var csRef = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id + "/csUser"); 
    var csSync = $firebase(csRef);



    // userSession.user = user;
    
    // var id = userSession.user.id;
    // var ref = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id);
    // var sync = $firebase(ref);
    // $rootScope.userId = id;
    // console.log("logged in, userId", $rootScope.userId);
    // var csRef = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id + "/csUser"); 
    // var csSync = $firebase(csRef);
    

    console.log(csSync);
  
      if (sync.type === "registered") {
        $state.go('tab.profile');
        console.log("IT WORKS FOOLZ");
       } else {
         userSession.user.type = "pending";
         sync.$set(authData.user);
         console.log(user);
         console.log("RUNNIN ELSE");
         $state.go('fss');
        }
      
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
    .state('tab.friend-detail', {
      url: '/connections/:friendId',
      views: {
        'tab-connections': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    .state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'js/profile/tab-profile.html',
          controller: 'profileCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});
