const fs = require('fs')

const path = require('path')

const {

  answerIndexlessDirectory,

  answerNotFound,

  tryDynamicAnswer,

  sendAnswer } = require('./answer_request.js')

const { fileExists,  isDirectory } = require('./helpers.js')

const contentTypes = require('./content_types.js')



async function findAnswer(request, response, paras) {

  let IS_DIR = false

  let requestedPath = request.url

  let filesPath = paras.filesPath

  let filePath = filesPath + requestedPath


  // Path equals an existing file, send it and abort:

  if(fileExists(filePath) && ! isDirectory(filePath)) {

    sendStaticFile(filePath, response, request)

    return

  }


  // Path equals an existing directory:

  if(fileExists(filePath) && isDirectory(filePath)) {

    // If index files are ignored, tell so and abort:

    if(paras.ignoreIndexFiles) {

      return sendAnswer(response, paras.answerIgnoredIndex(request))

    }

    // Otherwise remember it's a directory and extend path with 'index':

    IS_DIR = true

    if( ! filePath.endsWith('/') ) filePath += '/'

    filePath += 'index'

  }

  // If a dynamic answer is found, abort:

  if(await tryDynamicAnswer(filePath, response, request)) return


  // If an html-file is found, abort:

  if(fileExists(filePath + '.html')) {

    sendStaticFile(filePath + '.html', response)

    return

  }

  // If an json-file is found, abort:

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
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('Could not read file "' + filePath + '" ', err)
    } else {
      const extension = path.extname(filePath).slice(1)
      const type = contentTypes[extension]
      if(type === undefined) {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('Content-type for "' + filePath + '" not found')
      }
      else {
        sendAnswer(res, data, type)
      }
    }
  });
}



module.exports.findAnswer = findAnswer
