var Memcached = require('memcached')

var memcached = new Memcached("127.0.0.1:11211")
var lifetime = 3600

function end(msg) {
	if(msg) {
		console.log(msg)
	}
	memcached.end()
}

memcached.set("foo", 'bar', lifetime, function(err, result) {
	if(err)
		return end(err);

	memcached.get("foo", function(err, result) {
		if(err)
			return end(err);
		end(result);
	})
})