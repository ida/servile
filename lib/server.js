const fs = require('fs')

const http = require('http')

const { findAnswer } = require('./find_answer.js')

const { parseData } = require('./helpers.js')


let paras = {

    filesPath: process.cwd(),

    port: 3000,

    RELOAD: true

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

  if( options.filesPath && ! options.filesPath.startsWith('/')) {
    options.filesPath = process.cwd() + '/' + options.filesPath
  }

  for(option in options) paras[option] = options[option]

  server.listen(paras.port, () => {

    console.log(`Serving "${paras.filesPath}" on "http://localhost:${paras.port}"`)

  })

}


module.exports = server
