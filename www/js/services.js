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
    var fireSync = new Firebase(fireUrl);

  return {
    getUser: function() {
      return fireSync.getAuth();
    },
    setUser: function(user) {
      //grab id
      //put id on rootscope

    },
    logoutUser: function(){
      fireSync.unauth();
    },
    getUserData: function(id){
      return $firebase(new Firebase(fireUrl + 'users/' + id)).$asObject();
    },
    getUsers: function(){
      return $firebase(new Firebase(fireUrl + 'users/')).$asArray();
    }
  }

})

.factory('messageService', function($firebase, $q){
  var fireUrl = 'https://cancer-spot.firebaseio.com/';
  var fireSync = new Firebase(fireUrl);

    function createChatNode(chatNodeId, userId){
      var deferred = $q.defer();

      var chatsRef = new Firebase(fireUrl + "chats"); 
      var chatsSync = $firebase(chatsRef);
      
      chatsSync.$set(chatNodeId, {
        cid: chatNodeId,
        messages: [{
            text: 'Whats Up',
            senderId: userId,
            timeStamp: ''
          }]
        }).then(function(data){
          deferred.resolve(data);
        })
      return deferred.promise;
    };

    function addChatToUser(userId, friendUserId, chatNodeId, friendName){
      var myChatsRef = new Firebase(fireUrl + 'users/' + userId + "/myChats"); 
      var myChatsSync = $firebase(myChatsRef);

      myChatsSync.$set(chatNodeId, {
        cid: chatNodeId,
        chatters: [{id: friendUserId, name: friendName}]
      });
    } 


  return{
    createChat: function(myId, friendId, myName, friendName){
      var chatNodeId = myId + friendId
      createChatNode(chatNodeId, myId).then(function(data){
        addChatToUser(myId, friendId, chatNodeId, friendName);
        addChatToUser(friendId, myId, chatNodeId, myName);
      })
    },
  
    getMessages: function(){
      return $firebase(new Firebase(fireUrl + 'chats/')).$asArray();
    },

    getChat: function(cid){
      return $firebase(new Firebase(fireUrl + 'chats/' + cid + '/messages')).$asArray();
    }

    // getChatRoom: function(chatRoomId){
    //   return $firebase(new Firebase(firebaseUrl + '/chatrooms/' + chatRoomId + '/messages')); 
    // }

  }

});
