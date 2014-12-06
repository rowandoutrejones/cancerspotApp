angular.module('csApp.controllers', [])

.controller('exploreCtrl', function($scope, firebaseService, $stateParams, $rootScope, $state, messageService){
	$scope.users = firebaseService.getUsers();
	

	$scope.goTo = function(id) {
		$state.go('friend-detail/' + id);
	};

	$scope.createChat = function(){
		var me = firebaseService.getUser();
		messageService.createChat(me.facebook.id, this.user.id, me.facebook.displayName, this.user.csUser.userName);
		var cid = me.facebook.id + this.user.id;
		$state.go('chat/' + cid);	
	};
  	

})

.controller('connectionsCtrl', function($scope, firebaseService, $stateParams, $rootScope) {
  // $scope.users = firebaseService.getUsers();
})

.controller('friendDetailCtrl', function($scope, $stateParams, firebaseService, $rootScope, $state) {
  $scope.user = firebaseService.getUserData($stateParams.id);



  // $scope.friend = Friends.get($stateParams.friendId);
})

.controller('profileCtrl', function($scope, userSession, $rootScope, $firebase, firebaseService, $state) {
	var getAuth = function() {
		return firebaseService.getUser();
	}
	$scope.auth = getAuth();



	var parseId = function() {
	    var arr = $scope.auth.uid.split('');
	    var id = [];

	    for (var i = 0; i < arr.length; i++) {
			if(parseInt(arr[i]) || arr[i] === '0') {
				id.push(arr[i])
			}
	      
	    };
	    id = id.join('');
	    $scope.id = id;
	    }();

	var setUser = function() {
		return firebaseService.getUserData($scope.id);
	};


	$scope.currentUser = setUser();

	console.log("Current User is... this mutha trucka :", $scope.currentUser);

	$scope.logout=function(){
    	firebaseService.logoutUser();
    	$state.go('login')
	}

})

.controller('loginCtrl', function($scope, $firebaseAuth, $firebase, FIREBASE_REF, userSession, $stateParams, $rootScope, $state, firebaseService){
    
    var ref = new Firebase("https://cancer-spot.firebaseio.com/");
    var userRef = new Firebase("https://cancer-spot.firebaseio.com/users")
    var auth = $firebaseAuth(ref);





	// Handle third party login providers
    // returns a promise
    // function thirdPartyLogin(provider) {
    //     var deferred = $.Deferred();

    //     auth.authWithOAuthPopup(provider, function (err, user) {
    //         if (err) {
    //             deferred.reject(err);
    //         }

    //         if (user) {
    //             deferred.resolve(user);
    //         }
    //     });

    //     return deferred.promise();
    // };



    
    auth.$authWithOAuthPopup("facebook").then(function(authData) {
    console.log("Logged in as:", authData);
    console.log('id is omg: ', authData.facebook.cachedUserProfile.id);
    var check = firebaseService.getUserData(authData.facebook.cachedUserProfile.id);
    console.log('check is', check);

	 
	// Tests to see if /users/<userId> has any data. 
	  userRef.child(authData.facebook.cachedUserProfile.id).once('value', function(snapshot) { 
	  	
	    $scope.exists = (snapshot.val() !== null);
	    userExistsCallback(userId, exists);
	  		});
    if ($scope.exists) {
        	$state.go('tab.explore');
        	console.log("IT WORKS FOOLZ");
       	} else {
	        

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

  		authData.type = "pending";
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

			$state.go('tab.explore');
		}

})
.controller('messagesCtrl', function($scope, messageService, $state, $stateParams){

	$scope.messages = messageService.getMessages();
	// $scope.messages = messageService.getMyChats();
})
.controller('chatCtrl', function($scope, messageService, firebaseService, $stateParams, $rootScope, $state){
	
	$scope.messages = messageService.getChat($stateParams.cid);

	console.log($scope.messages)
    var side = 'left';
    var me = firebaseService.getUser();
    var userId = me.facebook.id;
    console.log(userId);   
    console.log('messages: ', $scope.messages)
    var changeSide = function(arr) {
    	debugger;
    	console.log('arr: ', arr[0])
    	for (var i = 0; i < arr.length; i++) {
    		console.log(arr[i])
    		if(arr[i].senderId === userId) {
    			arr[i].side = 'right';
    		}
    	};
    };
    changeSide($scope.messages);
    $scope.sendMessage = function (textMessage) {
        
        $scope.messages.$add({
        	text: textMessage, 
        	senderId: userId,
        	side: side,
        	timestamp: ''
        });
        
    };


  	// $scope.goTo = function(scrn) {
  	// 	$state.go(scrn);
  	// }
})
.controller('moreCtrl', function($scope, $stateParams, $rootScope, $state){
	
  	$scope.goTo = function(scrn) {
  		$state.go(scrn);
  	}

})
.service('mainService', function($firebase){

})

// spencer and rowan promised me all of alex's equity. ~Ean