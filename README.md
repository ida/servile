servile
=======


A quickstarter for NodeJS-based apps, automagically routing requests to files
of same name within the current folder.


What
====

- A static file server: Asking for 'example.org/picture.png', returns
  'picture.png', if present in the directory where node is executed.

- A dynamic file server: Asking for 'example.org/about' will check for:

1. A JS-file of same name: If it returns a function, execute the function
   upon the request-object. If a string was returned send it as the answer
   with content-type HTML, otherwise continue to next point.

2. A JSON-file of same name: Answer with content-type JSON.

3. An HTML-file of same name: Answer with content-type HTML.

4. A directory of same name: Add '/index' to the requested path and proceede
   from point 1.


- A parser for posted data: If a user fills out an HTML-form, the data is
  parsed to an object, e.g.: '{ "someFieldName": "someValue" }'.

- An unsecure allower of loading external resouces from other servers,
  by setting a CORS-header.

- A reloader if "require-reload" is installed, meaning changes in dynamic
  scripts take immediate effect, no server-restart needed.

- An independent package, because it has no dependencies.


Why
===

- Save time by not manually typing routing-logic.

- Save time by not parsing posted data.

- Save time by not fiddling with CORS-header, e.g. just for loading an avatar.

- Save time by not restarting the server to check script-modifications.

- Save time by not debugging dependencies.

- Save time by not downloading a huge framework like e.g. "express" is.


How
===

After installing this package with `npm install servile`, either add this line
to your main-script:

    require('servile').serve()

Or run servile's serve-script directly of the commandline:

    node node_modules/servile/serve.js

The console should then show something like:

    Serving "/home/user/mySuperApp" on "http://locahost:3000"

Now you can drop files in the directory where you run node and they be served.


Example
=======

For serving 'example.org/register' your 'register.js'-file could be:

    module.exports = req => {

      if(req.method == 'POST') {

        // Do something with req.data

      }

      return 'Some html'

    }


In case you want to do some backend-logic in the backgorund and then send a
static-file, simply remove the return-line and provide a 'register.json' or
'register.html'-file.


Futurama
========

Not yet implemented, but nice to have:

- Allow passing custom-port.

- Allow custom not-found- and is-directory-handlers.

- Allow setting up several servers.


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

