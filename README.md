**warning, work in progress**; questions, bug reports and pull requests
welcome. Reach me at Twitter [@statebox](https://twitter.com/statebox)
or plain e-mail `jelle@defekt.nl`.

# Retrieve sleep-monitoring data using NodeJS

[Beddit](http://www.beddit.com/) is pretty cool sleep monitor that uses
a pressure sensor to deduce your heart and breathing rates
(*respiration*), sleep cycles, and a bunch of other things. This technique is called
[Ballistocardiography](https://en.wikipedia.org/wiki/Ballistocardiography).

Just for fun, [here](http://advan.physiology.org/content/27/4/224) is a
2003 publication where they erect a whole *"BCG suspension table"* to
carry the person. So while non-invasive to the sleeping human, this is
not as non-invasive to your bedroom as the Beddit sensor strip! :-)

Their API is described [here](https://github.com/beddit/beddit-api) and this
library wraps it up for use with NodeJS.

## How can I use this library?

Simply add `beddit-api` as a dependency to your node project and then
try this:

```javascript
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
```

(Yes, I know you need to thread the `beddit` var down into the
post-authentication handler. This is ugly and can be avoided and I'll
solve this when I have time.)

## What else

I wrote a small commandline tool that you can use in scripts. It uses
this library, [check it out](https://github.com/0x01/beddit).
