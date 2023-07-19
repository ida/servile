const fs = require('fs')

const path = require('path')

const { fileExists, isDirectory } = require('./helpers.js')

const contentTypes = require('./content_types.js')

const {

  answerIndexlessDirectory,

  answerNotFound,

  tryDynamicAnswer,

  tryStaticAnswer,

  sendAnswer,

} = require('./answer_request.js')



async function findAnswer(request, response, paras) {

  let IS_DIR = false

  let filePath = paras.filesPath + request.url


  if(tryStaticAnswer(response, filePath)) return


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

  if(await tryDynamicAnswer(filePath, response, request)) return

  if(tryStaticAnswer(response, filePath + '.html')) return

  if(tryStaticAnswer(response, filePath + '.json')) return

  if(IS_DIR) answerIndexlessDirectory(paras.answerDirectory, request, response)

  else answerNotFound(paras.answerNotFound, request, response)

}



module.exports.findAnswer = findAnswer
