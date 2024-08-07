servile
=======


A lightweight quickstarter for NodeJS-based apps, automagically routing
requests to files of same name within a given folder. For local use and
prototyping, not ment for production.


What
====

a. A static file server: Asking for 'example.org/picture.png', returns
   'picture.png', if present in a given directory.

b. A dynamic file server: Asking for 'example.org/about' will check for:

1. A JS-file of same name: If it returns a function, execute the function
   upon the request- and response-object. If a string was returned send it
   as the answer with content-type HTML, if an object was returned send it
   as the answer with content-type JSON, otherwise continue to next point.

2. An static (html, json, md, txt) file of same name:
   Answer with fitting content-type.

3. A directory of same name: Add '/index' to the requested path and proceed
   from point 1.


c. A parser for posted data: If a user fills out an HTML-form, the data is
   parsed to an object, e.g.: '{ "someFieldName": "someValue" }'.

d. A CORS header setter.

e. A supporter for server-side-events (SSE).

f. A supporter for synchronous functions with the async/await-syntax.


Why
===

a. Save time by not downloading a huge framework.

b. Save time by not manually typing routing logic.

c. Save time by not adding a middleware for parsing posted data.

d. Save time by not setting a CORS header, so others can load your resources.

e. Save time by not setting up a websocket-server for talking to the client.

f. Save time by not writing endless callback hells and get that Python feeling.

If you want to save even more time during development, check out the packages
'nodemon' and 'browser-sync'.


How
===

After installing this package with `npm i servile` in your package, add this
line to your main-script and run it:

    require('servile').serve()

The console should then show something like:

    Serving "/home/user/mySuperApp" on "http://localhost:3000"

Now you can drop files in the directory where you are and they be served.


You can also install servile globally with `npm i servile -g`
and then do this of the commandline in any directory:

    serve


Options
-------

You can specify all, or some, or one of the following options:

    require('servile').serve({
      filesPath: 'public',
      port: 2727,
      answerNotFound:  req => { return `Nothing found for ${req.url}` },
      answerDirectory: req => { return `Found folder ${req.url}`},
      ignoreIndexFiles: false,
      staticIndexTypes: ['html', 'json', 'md', 'txt']
    })


On the commandline you can pass 'port' and 'filesPath':

    serve -p 8080 -f publik


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
a 'register.json'-file.


Synchronous functions are supported, using the async/await syntax.
If you want or need that, the script would be roughly like this:

    module.exports = async (request, response) => {

        await yourHandler(request)

    }


The response object is passed, too, to give you full control:

    module.exports = (request, response) => {

        response.writeHead(400, { "Content-Type": "text/html" })

        response.end("<h1>400 – Bad request</h1>"
                   + "<p>You've been a bad, bad requester.</p>")

    }



Server side events
------------------

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

    const { sendToClient, sendToClients } = require('./path/to/stream.sse')

Note that the file-extension '.sse' needs to be written, too.


You can then handle the message on the client-side in a frontend-script:


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
