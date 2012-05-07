var Memcached = require( 'memcached' )

var memcached = new Memcached("127.0.0.1:11211")
var lifetime  = 3600


function FollowDB() {
  var users = {}

  this.follow = function(user,follower) {
    users[user] = ( users[user] || {name:user} )
    users[user].followers = ( users[user].followers || [] ) 
    users[user].followers.push(follower)

    users[follower] = ( users[follower] || {name:follower} )
    users[follower].following = ( users[follower].following || [] ) 
    users[follower].following.push(user)
  }

  this.user = function(user){
    return users[user]
  }
}


function FollowAPI( followdb ) {

  function error(win) {
    return function( err, result ) {
      if( err ) {
        console.log(err)
      }
      else {
        win && win(result)
      }
    }
  }

  function incr(user,win){
    memcached.incr( user+'_v', 1, error(function(res){
      if( !res ) {
        memcached.set( user+'_v', 0, lifetime, error(function(){
          win()
        }))
      }
      else {
        win()
      }
    }))
  }

  this.follow = function(user,follower,win) {
    followdb.follow(user,follower)
    incr(user,function(){
      incr(follower,win)
    })
  }

  this.user = function(user,win) {
    memcached.get( user+'_v', error(function( user_v ){
      user_v = user_v || 0
      var user_f_key = user+'_'+user_v+'_f'

      memcached.get( user_f_key, error(function( user_f ){
        if( user_f ) {
          user_f.cache = 'hit'
          win(user_f)
        }
        else {
          user_f = followdb.user(user)
          memcached.set( user_f_key, user_f, lifetime, error(function(){
            user_f.cache = 'miss'
            win(user_f)
          }))
        }
      }))
    }))
  }
}


var followdb = new FollowDB()
var followapi = new FollowAPI(followdb)

function printuser(next){
  return function(user) {
    console.log(user.name+':'+JSON.stringify(user,null,2))
    next && next()
  }
}

followapi.follow('alice','bob',function(){

  followapi.user('alice',printuser(function(){
    followapi.user('alice',printuser(function(){
    
      followapi.follow('jim','alice',function(){

        followapi.user('alice',printuser())
      })
    }))
  }))
})
