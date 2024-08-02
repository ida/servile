const http = require('http')

const path = require('path')

const { parseData } = require('./logic/helpers.js')

const { answerDirectory } = require('./answers/answer_directory.js')

const answerNotFound = require('./answers/answer_not_found.js')

const { searchAnswer } = require('./logic/search_answer.js')

const { tryServerSideEventAnswer } = require('./logic/try_answer.js')



// Set default options for server.serve():

let paras = {

    filesPath: process.cwd(),

    port: 3000,

    answerDirectory: req => answerDirectory(req, paras.filesPath),

    answerNotFound: answerNotFound,

    ignoreIndexFiles: false,

    staticIndexTypes: ['html', 'json', 'md', 'txt']

}



function handleRequest(request, response) {


  // Compose extensionless filePath:

  paras.filePath = paras.filesPath + decodeURIComponent(request.url)


  // If an SSE file can be found, abort:

  if(tryServerSideEventAnswer(request, response, paras)) return


  // Collect posted data:

  let data = []; request.on('data', chunk => data.push(chunk))

  // After data was collected:

  request.on('end', async () => {

      // Attach posted data to request:

      if(data != '') request.data = parseData(data)

      // And search for an answer:

      searchAnswer(request, response, paras)

  })

}



// Create server:

const server = http.createServer(handleRequest)


// Define serve method:

server.serve = options => {


  // Make possibly passed filesPath absolute:

  if(options && options.filesPath) {

    options.filesPath = path.resolve(

      process.cwd(),

      options.filesPath

    )

  }


  // Override default options with passed options:

  for(const option in options) paras[option] = options[option]


  // Start server:

  server.listen(paras.port, () => {

    console.log(`Serving "${paras.filesPath}" on "http://localhost:${paras.port}"`)

  })

}


module.exports = server
