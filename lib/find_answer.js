const {

  answerIndexlessDirectory,

  answerNotFound,

  tryDynamicAnswer } = require('./answer_request.js')

const { fileExists,  isDirectory } = require('./helpers.js')

const staticServer = require('node-static')



async function findAnswer(request, response, paras) {

  let IS_DIR = false

  let requestedPath = request.url

  let filePath = paras.filesPath + requestedPath

  let fileServer = new(staticServer.Server)(paras.filesPath)


  if(fileExists(filePath) && ! isDirectory(filePath)) {

    fileServer.serve(request, response)

    return

  }


  if(fileExists(filePath) && isDirectory(filePath)) {

    IS_DIR = true

    if( ! filePath.endsWith('/') ) filePath += '/'

    filePath += 'index'

  }

  if(await tryDynamicAnswer(filePath, response, request)) return

  if(fileExists(filePath + '.html')) {

    request.url += '.html'

    fileServer.serve(request, response)

    return

  }

  if(fileExists(filePath + '.json')) {

    request.url += '.json'

    fileServer.serve(request, response)

    return

  }

  if(IS_DIR) answerIndexlessDirectory(paras.answerDirectory, request, response)

  else answerNotFound(paras.answerNotFound, request, response)

}


module.exports.findAnswer = findAnswer
