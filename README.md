**warning, work in progress**

# Simple nodejs script to get your data from the Beddit API

Install deps

	npm i

Run it

	node beddit.js --user=you@example.com --pass=s3cr3t

## How can I use this API?

Not so fast buddy, once I finish it up, you will be able to get this
from NPM and use it as a lib in your own scripts.

For now, here This is the code that is currently included in `beddit.js`, to give you some idea.

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

