const http = require('http')

const { findAnswer } = require('./find_answer.js')

const { fileExists, parseData } = require('./helpers.js')

const genHtml = text => {

  return `

<style>

  @media (prefers-color-scheme: dark) {

    :root {

      background: rgb(28,27,34);

      color: rgb(251,251,254)

    }

  }

</style>


${text}


  `

}


let paras = {

    filesPath: process.cwd(),

    port: 3000,

    answerNotFound: req => { return genHtml(`Nothing found for ${req.url}`) },

    answerDirectory: req => { return genHtml("This folder doesn't have an index-file.") }

}


function handleRequest(request, response) {

  // Forserver-side-events:

  let ssePath = paras.filesPath + request.url + '.sse'

  if( fileExists(ssePath) ) {

      // Set headers:

      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      })

      // Expect it to export a main-func and execute it upon req and res:

      require(ssePath).main(request, response)

      // Do *not* close request, nor response.

  }

  // For all other than server-side-events:

  else {

    // Collect posted data:

    let data = []; request.on('data', chunk => data.push(chunk))

    // After data was collected:

    request.on('end', async () => {

        // Attach posted data to request:

        if(data != '') request.data = parseData(data)

        // And search for an answer:

        findAnswer(request, response, paras)

    }) // req end'

  } // not sse

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
