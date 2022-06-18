const fs = require('fs')

const path = require('path')

const {

  answerIndexlessDirectory,

  answerNotFound,

  tryDynamicAnswer } = require('./answer_request.js')

const { fileExists,  isDirectory } = require('./helpers.js')

const contentTypes = require('./content_types.js')



async function findAnswer(request, response, paras) {

  let IS_DIR = false

  let requestedPath = request.url

  let filesPath = paras.filesPath

  let filePath = filesPath + requestedPath

  let headers = {"Cache-Control": "no-cache, must-revalidate"}


  if(fileExists(filePath) && ! isDirectory(filePath)) {

    sendStaticFile(filePath, response)

    return

  }


  if(fileExists(filePath) && isDirectory(filePath)) {

    IS_DIR = true

    if( ! filePath.endsWith('/') ) filePath += '/'

    filePath += 'index'

    request.url += 'index'

  }


  if(await tryDynamicAnswer(filePath, response, request)) return


  if(fileExists(filePath + '.html')) {

    sendStaticFile(filePath + '.html', response)

    return

  }

  if(fileExists(filePath + '.json')) {

    sendStaticFile(filePath + '.json', response)

    return

  }

  if(IS_DIR) answerIndexlessDirectory(paras.answerDirectory, request, response)

  else answerNotFound(paras.answerNotFound, request, response)

}


function sendStaticFile(filePath, res) {

  fs.readFile(filePath, (err, data) => {
    if(err) {
      console.debug('fs.readFile error:', err)
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('Could not read file "' + filePath + '" ', err)
    } else {
      const extension = path.extname(filePath).slice(1)
      const type = extension ? contentTypes[extension] : null
      if( ! type ) {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('Content-type "' + type + '"not found')
      }
      res.writeHead(200, { 'Content-Type': type })
      res.end(data)
    }
  });
}



module.exports.findAnswer = findAnswer
