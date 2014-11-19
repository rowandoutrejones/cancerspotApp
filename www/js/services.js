angular.module('csApp.services', [])

    .value('FIREBASE_REF','https://cancer-spot.firebaseio.com')
    .value('userSession',{})
/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('firebaseService', function($firebase){
    var fireUrl = 'https://cancer-spot.firebaseio.com/';

  return {
    getUser: function(id) {
      console.log("ref", fireUrl + 'users/' + id + '/csUser');
      return $firebase(new Firebase(fireUrl + 'users/' + id + '/csUser')).$asObject();
    }

  }

});
