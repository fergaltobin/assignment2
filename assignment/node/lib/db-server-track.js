var common = require('./common')
var api = require('./db-rest-api')
var everyauth = common.everyauth
var dispatch = common.dispatch
var connect = common.connect
var DataCapsule = common.DataCapsule
var config = common.config

var dc, authcap

function init_datacapsule() {
	dc = new DataCapsule({})

	dc.capsule('internal', 'user', config.secret, function(err, cap) {
		if(err)
			return console.log(err);
		authcap = cap
	})
}

function init() {

	init_datacapsule();

	function make_promise(user, promise) {
		authcap.save(user, function(err, user) {
			if(err)
				return promise.fail(err)
			promise.fulfill(user)
		})
		return promise
	}

	// turn on to see OAuth flow
	everyauth.debug = true

	everyauth.everymodule.findUserById(function(id, callback) {
		authcap.load(id, function(err, user) {
			if(err)
				return callback(err);
			callback(null, user)
		})
	}).moduleErrback(function(err, data) {
		if(err)
			console.dir(err);
		throw err;
	})

	everyauth.twitter.consumerKey(config.twitter.key).consumerSecret(config.twitter.secret).findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserMetadata) {

		var user = {
			id : 'tw-' + twitterUserMetadata.id,
			username : twitterUserMetadata.screen_name,
			service : 'twitter',
			key : accessToken,
			secret : accessTokenSecret
		}

		return make_promise(user, this.Promise())
	}).redirectPath('/')

	everyauth.facebook.appId(config.facebook.key).appSecret(config.facebook.secret).findOrCreateUser(function(session, accessToken, accessTokenExtra, fbUserMetadata) {

		var user = {
			id : 'fb-' + fbUserMetadata.id,
			username : fbUserMetadata.username,
			service : 'facebook',
			key : accessToken
		}

		return make_promise(user, this.Promise())
	}).mobile(true).scope('publish_stream,email').redirectPath('/')

	var server = connect.createServer()
	server.use(connect.logger())
	server.use(connect.bodyParser())
	server.use(connect.cookieParser());
	server.use(connect.query())
	server.use(connect.session({
		secret : config.secret
	}))
	server.use(everyauth.middleware())
	//server.use(dc.middleware())

	server.use(function(req, res, next) {
		res.sendjson$ = function(obj) {
			common.sendjson(res, obj)
		}
		res.send$ = function(code, text) {
			res.writeHead(code, '' + text)
			res.end()
		}
		res.err$ = function(win) {
			return function(err, output) {
				if(err) {
					console.log(err)
					res.send$(500, err)
				} else {
					win && win(output)
				}
			}
		}
		next()
	})
	var router = connect.router(function(app) {
		app.get('/api/ping', api.ping)
		app.get('/api/echo', api.echo)
		app.post('/api/echo', api.echo)
		app.post('/api/rest/inventory', api.rest.create)
		app.get('/api/rest/inventory/:id', api.rest.read)
		app.get('/api/rest/login/:id', api.rest.readlogin)
		app.get('/api/rest/login', api.rest.readlogin)
		app.get('/api/rest/inventory', api.rest.list)
		app.put('/api/rest/inventory/:id', api.rest.update)
		app.del('/api/rest/inventory/:id', api.rest.del)

	})

	server.use(dispatch({
		'/user' : {
			GET : api.get_user,
			'/socialmsg/:when' : {
				POST : api.social_msg
			}
		}
	}))

	server.use(router, null)

	server.use(connect.static(__dirname + '/../../site/iphone'))

	api.connect({
		name : 'inventorylist',
		server : 'services.dreeling.com',
		port : 27017
	}, function(err) {
		if(err)
			return console.log(err);

		server.listen(8183)
	})
}

init()