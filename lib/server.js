const http = require('http')

const { findAnswer } = require('./find_answer.js')

const { fileExists, parseData } = require('./helpers.js')


let paras = {

    filesPath: process.cwd(),

    port: 3000,

    answerNotFound: req => { return `Nothing found for ${req.url}` },

    answerDirectory: req => { return "This folder doesn't have an index-file." }

}


function handleRequest(request, response) {

  let ssePath = paras.filesPath + request.url + '.sse'

  // Collect posted data:

  let data = []; request.on('data', chunk => data.push(chunk))

  // After data was collected:

  request.on('end', async () => {

    // And we are not a server-side-event-stream:

    if( ! fileExists(ssePath) ) {

      // Attach posted data to request:

      if(data != '') request.data = parseData(data)

      // And search for an answer:

      findAnswer(request, response, paras)

    }

    // For a server-side-event-stream:

    else {

      // Set headers:

      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      })

      // Expect it to export a main-func and execute it upon req and res:

      require(ssePath).main(request, response)

    }

  }) // req.on('end')

}


const server = http.createServer(handleRequest)


server.serve = (options) => {

  for(const option in options) paras[option] = options[option]

  if( ! paras.filesPath.startsWith('/') ) {

    paras.filesPath = process.cwd() + '/' + paras.filesPath

  }

  server.listen(paras.port, () => {

    console.log(`Serving "${paras.filesPath}" on "http://localhost:${paras.port}"`)

  })

}


module.exports = server
