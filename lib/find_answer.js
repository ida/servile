const fs = require('fs')

const { fileExists, isDirectory } = require('./helpers.js')

const contentTypes = require('./content_types.js')

const {

  handleDynamicAnswer,

  tryDynamicAnswer,

  tryStaticAnswer,

  sendAnswer,

} = require('./answer_request.js')



async function findAnswer(request, response, paras) {

  let IS_DIR = false

  let filePath = paras.filesPath + request.url


  // If filePath is a file, serve it and abort:

  if(tryStaticAnswer(response, filePath)) return


  // If filePath is a directory and index files are not ignored,
  // extend filePath with '/index':

  if(fileExists(filePath) && isDirectory(filePath)) {

    IS_DIR = true

    if( ! paras.ignoreIndexFiles ) {

      if( ! filePath.endsWith('/') ) filePath += '/'

      filePath += 'index'

    }

  }


  // If a dynamic file of same name exists and returns something, serve it and abort:

  if(await tryDynamicAnswer(filePath, response, request)) return


  // If a static file of same name exists, serve it and abort:

  for(let staticType of paras.staticIndexTypes) {

    if(tryStaticAnswer(response, filePath + '.' + staticType)) return

  }


  // Answer directory without an index-file:

  if(IS_DIR) { return handleDynamicAnswer(request, response, paras.answerDirectory) }


  // Could not find an answer:

  else { return handleDynamicAnswer(request, response, paras.answerNotFound) }


}



module.exports.findAnswer = findAnswer
