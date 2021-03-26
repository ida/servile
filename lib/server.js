const http = require('http')

const { findAnswer } = require('./find_answer.js')

const { parseData } = require('./helpers.js')


let paras = {

    filesPath: process.cwd(),

    port: 3000,

    RELOAD: true,

    answerNotFound: req => { return `Nothing found for ${req.url}` },

    answerDirectory: req => { return "This folder doesn't have an index-file." }

}


function handleRequest(request, response) {

  let data = []; request.on('data', chunk => data.push(chunk))

  request.on('end', async () => {

    if(data != '') request.data = parseData(data)

    findAnswer(request, response, paras)

  });

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
