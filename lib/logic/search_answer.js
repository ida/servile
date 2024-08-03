const { fileExists, isDirectory } = require('./helpers.js')

const { answerDynamical } = require('./../answers/answer_dynamic_file.js')

const { tryDynamicFileAnswer, tryStaticFileAnswer } = require('./try_answer.js')



async function searchAnswer(request, response, paras) {

  let IS_DIR = false

  let filePath = paras.filesPath + decodeURIComponent(request.url)


  // If filePath is a file, serve it and abort:

  if(tryStaticFileAnswer(response, filePath)) return


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

  if(await tryDynamicFileAnswer(filePath, response, request)) return


  // If a static file of same name exists, serve it and abort:

  for(let staticType of paras.staticIndexTypes) {

    if(tryStaticFileAnswer(response, filePath + '.' + staticType)) return

  }


  // Answer directory without an index-file:

  if(IS_DIR) { return answerDynamical(request, response, paras.answerDirectory) }


  // Could not find an answer:

  else { return answerDynamical(request, response, paras.answerNotFound) }


}



module.exports.searchAnswer = searchAnswer
