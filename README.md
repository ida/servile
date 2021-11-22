servile
=======


A quickstarter for NodeJS-based apps, automagically routing requests to files
of same name within a given folder.


What
====

- A static file server: Asking for 'example.org/picture.png', returns
  'picture.png', if present in a given directory.

- A dynamic file server: Asking for 'example.org/about' will check for:

1. A JS-file of same name: If it returns a function, execute the function
   upon the request- and response-object. If a string was returned send it
   as the answer with content-type HTML, if an object was returned send it
   as the answer with content-type JSON, otherwise continue to next point.

2. An HTML-file of same name: Answer with content-type HTML.

3. A JSON-file of same name: Answer with content-type JSON.

4. A directory of same name: Add '/index' to the requested path and proceed
   from point 1.


- A parser for posted data: If a user fills out an HTML-form, the data is
  parsed to an object, e.g.: '{ "someFieldName": "someValue" }'.

- An unsecure allower of loading external resouces from other servers,
  by setting a CORS-header.

- A supporter for server-side-events.


Why
===

- Save time by not downloading a huge framework like e.g. "express" is.

- Save time by not manually typing routing-logic.

- Save time by not parsing posted data.

- Save time by not fiddling with CORS-header, e.g. just for loading an avatar.

- Save time by not restarting the server to check script-modifications.

- Because it's 2021.

If you want to save even more time during development, check out the packages
'nodemon' and 'browser-sync'.


How
===

After installing this package with `npm install servile`, either add this line
to your main-script:

    require('servile').serve()

Or run the serve-script directly of the commandline:

    node node_modules/servile/lib/serve.js

The console should then show something like:

    Serving "/home/user/mySuperApp" on "http://locahost:3000"

Now you can drop files in the directory where you run node and they be served.


Options
-------

You can specify all or some, or one of the following options:

    require('servile').serve({
      filesPath: 'public',
      port: 2727,
      answerNotFound:  req => { return `Nothing found for ${req.url}` },
      answerDirectory: req => { return "No index-file in this folder." }
    })


Example
=======

For serving 'example.org/register' your 'register.js'-file could be:

    module.exports = (request, response) => {

      if(request.data) {

        // do something with request.data

      }

      return 'Some html'

    }


In case you want to do some backend-logic in the background and then send a
static-file, simply remove the return-line and provide a 'register.html' or
'register.json'-file.


Server side events (SSE) are supported, e.g. for serving 'example.org/stream'
your 'stream.sse'-file is expected to export a main-function and could be like:

	let clientId = 0
	let clients = {}

	function sendToClient(client, data) {
	  client.write('id: ' + (new Date()).toLocaleTimeString() + '\n')
	  client.write('data: ' + data + '\n\n')
	}

	function sendToClients(data) {
	  for(clientId in clients) {
		sendToClient(clients[clientId], data)
	  }
	}

	function main(req, res) {

      (function (clientId) {
        clients[clientId] = res       // collect new client
        req.on('close', function () { // client disconnected
          delete clients[clientId]    // remove client
        })
      })(++clientId)

	  sendToClient(res, 'Welcome client, you are connected!')

	  sendToClients('We got a new member joining!')

	}


	module.exports = {
	  main: main,
	  sendToClient: sendToClient,
	  sendToClients: sendToClients
	}



You can use the exported methods in other scripts like this:

    const { sendToClient, sendToClients } = require('./path/to/events.sse')

Note that the file-extension '.sse' needs to be written, too.


You can then handle the message on the client side in a frontend-script:


	var source = new EventSource('/stream') // name of sse-file

	source.onmessage = function(eve) {

	  console.log(eve)

	}




Author
======

Ida Ebkes, 2019.


License
=======

MIT, a copy is attached.


Contact
=======

For bug-reports or any message you want to transmit, please open an issue on:

https://github.com/ida/servile/issues

Contributions are very welcome, if you're a beginner don't hesitate to ping.
