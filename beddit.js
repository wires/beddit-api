var Q = require('kew');
var http = require('request');
var argv = require('minimist')(process.argv.slice(2));

function resource(x) {
    return 'https://cloudapi.beddit.com/api/v1/' + x;
}

function userToken(auth) {
    var deferred = Q.defer();

    var data = {
	grant_type: 'password',
	username: auth.username,
	password: auth.password
    }

    http.post(resource('auth/authorize'), {form:data}, function(err, res, body){
	// console.log(err, res, body);
	if(err)
	    return deferred.reject(err);

	var d = JSON.parse(body);
	deferred.resolve({
	    token: d.access_token,
	    id: d.user
	});
    });

    return deferred;
}

function sleep(user) {
    var deferred = Q.defer();

    var options = {
	url: resource('user/' + user.id + '/sleep'),
	headers: {
	    Authorization: "UserToken " + user.token
	}
    }

    http.get(options, function(err, res, body){
	if(err)
	    deferred.reject(err);
	else
	    deferred.resolve(JSON.parse(body));
    });

    return deferred;
}

userToken({username: argv.user, password: argv.pass}).then(function(user){
    sleep(user).then(function(sleep_data){
	console.log(sleep_data);
    });
});
