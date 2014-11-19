angular.module('csApp.controllers', [])

.controller('exploreCtrl', function($scope, $stateParams){

})

.controller('connectionsCtrl', function($scope, Friends, $stateParams) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('profileCtrl', function($scope, userSession, $rootScope, $firebase, firebaseService) {
	$scope.currentUser = firebaseService.getUser();

	console.log($scope.currentUser);


	$scope.logout=function(){
    	ref.unauth();
	}

})

.controller('loginCtrl', function($scope, $firebaseAuth, $firebase, FIREBASE_REF, userSession, $stateParams, $rootScope, $state){
    
    var ref = new Firebase("https://cancer-spot.firebaseio.com/");
    var auth = $firebaseAuth(ref);
    
    auth.$authWithOAuthPopup("facebook").then(function(authData) {
    console.log("Logged in as:", authData.uid);

      	var id = authData.facebook.id;
      	var ref = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id);
	    var sync = $firebase(ref);
	    
	    var authData = ref.getAuth();
	    $rootScope.authData = authData;
	    
	    console.log(authData);
	    
	    $rootScope.authData.facebook.id = id;

	    console.log("logged in, userId", $rootScope.userId);
	    var csRef = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id + "/csUser"); 
	    var csSync = $firebase(csRef);


    	console.log(csSync);
  
      	if (sync.type === "registered") {
        	$state.go('tab.profile');
        	console.log("IT WORKS FOOLZ");
       	} else {
	        authData.facebook.type = "pending";
	        sync.$set(authData.facebook);
	        console.log("RUNNIN ELSE");
	        $state.go('fss');
        }
    }).catch(function(error) {
      console.error("Authentication failed: ", error);
    });

})

.controller('fssCtrl', function($scope, $state, $firebase, $rootScope, userSession){
		var id = $rootScope.authData.facebook.id;
		console.log(id);
		var user = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id + '/csUser');
    	var csUser = $firebase(user);
    	var userType = new Firebase("https://cancer-spot.firebaseio.com/" + 'users/' + id);
    	var typeSync = $firebase(userType);
    		console.log(typeSync);
    	$scope.csUser = {
    		userName: $rootScope.authData.facebook.cachedUserProfile.first_name, 
    		cancerType: "",
    		birthday: "",
    		location: "",
    		bio: ""
    	}
    	
    	 

		$scope.fss = function(item){
				csUser.$set({type: item, coolLevel: 10});
				typeSync.$update({type: "registered"});

				console.log(item);
				
				$state.go('fighterCreate');

			}

		$scope.fighterCreate = function(){
			console.log(csUser);
			csUser.$update($scope.csUser);

			$state.go('tab.profile');
		}

})
.service('mainService', function($firebase){

})