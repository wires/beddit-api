var Q = require('kew');
var request = require('request');
var argv = require('minimist')(process.argv.slice(2));
var prettyjson = require("prettyjson");


var Beddit = function(options) {
    this.options = {
	baseURL: (options && options.baseURL) || 'https://cloudapi.beddit.com/api/v1/',
    }
}

Beddit.prototype._call = function(method, resource, data)
{
    var deferred = Q.defer();
    
    var options = {
	url: this.options.baseURL + resource,
	method: method.toUpperCase()
    };

    // if Beddit object has authorization data, add the appropriate headers
    if(this.authorized)
	options.headers = { Authorization: "UserToken " + this.authorized.token };
    
    // add form data if it's a post
    if(options.method === 'POST')
	  options.form = data;

    // otherwise for get we should add it as query parameters
    // TODO

    // generic callback, handle error, parse body
    var callback = function(err, res, body)
    {
	// request failed
	if(err)
	    return deferred.reject(err);

	// API should have returned valid JSON now
	var r = JSON.parse(body);

	// see https://github.com/beddit/beddit-api/blob/master/1-General.md#conventions-for-error-responses
        if(res.statusCode in [400, 403, 404, 410])
	    return deferred.reject(r)

	// ok, all good, return response
	deferred.resolve(r);
    };

    // perform the HTTP request
    request(options, callback);

    return deferred.promise;
}

/**
 Call this to get a user token, returns a promise that
 upon completion returns an object of the form
     
    { token: '...', id: '...' }

 Being the access token and the user id, as per
 https://github.com/beddit/beddit-api/blob/master/2-Authentication.md
*/
Beddit.prototype.login = function(username, password) {
    return this.
	_call('POST', 'auth/authorize', {
	    grant_type: 'password',
	    username: username,
	    password: password
	})
	.then(function(result){

	    // store access token and user id
	    this.authorized = {
		token: result.access_token,
		id: result.user
	    };

	    return this.authorized;
	}.bind(this));
};

/** Retrieve all sleep data */
Beddit.prototype.sleep = function() {	
    return this._call('GET', 'user/' + this.authorized.id + '/sleep');
};


// example usage

var beddit = new Beddit();

beddit
    .login(argv.user, argv.pass)
    .then(function(auth) {
	beddit
	    .sleep()
	    .then(function(sleep_data) {

		console.log(prettyjson.render(sleep_data));
		
	    });
    });
