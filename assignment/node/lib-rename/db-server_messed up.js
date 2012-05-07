
var common = require('./common')
var api    = require('./db-rest-api')


var connect = common.connect
var dispatch   = common.dispatch
var everyauth  = common.everyauth
var DataCapsule = common.DataCapsule
var dc, authcap

function init() {
 dc = new DataCapsule({})

  dc.capsule( 'internal','user', config.secret, function( err, cap ) {
    if( err) return console.log(err);
    authcap = cap
  })
  
  var server = connect.createServer()
  server.use( connect.logger() )
  server.use( connect.bodyParser() )
  server.use( connect.query() )
   server.use( dc.middleware() )
  server.use( everyauth.middleware())
  server.use(   dispatch({
      '/user': {
       GET: api.get_user,
        '/socialmsg/:when': {
          POST: api.social_msg
        }
      }
    })
	)
  server.use( function( req, res, next ) {
    res.sendjson$ = function( obj ) {
      common.sendjson( res, obj )
    }

    res.send$ = function( code, text ) {
      res.writeHead( code, ''+text )
      res.end()
    }

    res.err$ = function(win) {
      return function( err, output ) {
        if( err ) {
          console.log(err)
          res.send$(500, err)
        }
        else {
          win && win(output)
        }
      }
    }

    next()
  })

   function make_promise( user, promise ) {
    authcap.save( user, function( err, user ){
      if( err ) return promise.fail(err)
      promise.fulfill(user)
    })

    return promise
  }

  // turn on to see OAuth flow
  //everyauth.debug = true

  everyauth.everymodule
    .findUserById(function(id,callback){
      authcap.load(id,function( err, user ){
        if( err ) return callback(err);
        callback(null,user)
      })
    })
    .moduleErrback( function (err, data) {
      if( err ) console.dir(err);
      throw err;
    })

  everyauth.twitter
    .consumerKey( config.twitter.key )
    .consumerSecret( config.twitter.secret )
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {

      var user = { 
        id:'tw-'+twitterUserMetadata.id, 
        username: twitterUserMetadata.screen_name, 
        service:'twitter',
        key:accessToken,
        secret:accessTokenSecret
      }

      return make_promise( user, this.Promise() )
    })
    .redirectPath('/')
 
  
  var router = connect.router( function( app ) {
    app.get('/api/ping', api.ping)
    app.get('/api/echo', api.echo)
    app.post('/api/echo', api.echo)

    app.post('/api/rest/todo',    api.rest.create)
    app.get('/api/rest/todo/:id', api.rest.read)
    app.get('/api/rest/todo',     api.rest.list)
    app.put('/api/rest/todo/:id', api.rest.update)
    app.del('/api/rest/todo/:id', api.rest.del)
  })
  server.use(router)

  server.use( connect.static( __dirname + '/../../site/public') )


  api.connect(
    {
      
	  name:   'mobileassignment2',
	 
      server:   'staff.mongohq.com',
      port:     10060,
      username: 'mwd',
      password: 'letmein1',	  
    },
    
    function(err){
      if( err ) return console.log(err);
      
      server.listen(8180)
    }
  )
}

function start() {
  init_datacapsule(init_connect)
}

exports.start = start


init()