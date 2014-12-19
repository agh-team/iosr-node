
var Users = function() {
    this._users = new Array();
    var that = this;
    //---cleaner
    this.cleanerInterval = setInterval(function(){
        var tmpUsers = new Array();
         for(var i in that._users){
          if((new Date() - that._users[i].lastActive)/1000 < that.expirationTime ){
              tmpUsers[i] = that._users[i];
          }else{
              console.log('expired user id: '+i);
          }  
         }
         that._users = tmpUsers;
    },1000);
};
Users.prototype.expirationTime = 3600; // <----- session time

Users.prototype.getUser = function(id){
    if (typeof this._users[id] !== "undefined") {
        this._users[id].lastActive = new Date();
        return this._users[id];
    } else
        return false;
};

Users.prototype.addUser = function(user) {
    this._users[user.id] = user;
    this._users[user.id].lastActive = new Date();
    return user;
};

module.exports = Users;