const fs = require('fs')

const http = require('http')

const { findAnswer } = require('./find_answer.js')

const { parseData } = require('./helpers.js')


let paras = {}


function handleRequest(request, response) {

  let data = []; request.on('data', chunk => data.push(chunk))

  request.on('end', async () => {

    if(data != '') request.data = parseData(data)

    findAnswer(request, response, paras.filesPath, paras.RELOAD)

  });

}


const server = http.createServer(handleRequest)


server.serve = (

  options={

    filesPath: process.cwd(),

    port: 3000,

    RELOAD: true

  }) => {

  if( ! options.filesPath.startsWith('/')) {
    options.filesPath = process.cwd() + '/' + options.filesPath
  }

  paras = options

  server.listen(paras.port, () => {

    console.log(`Serving "${paras.filesPath}" on "http://localhost:${paras.port}"`)

  })

}


module.exports = server
