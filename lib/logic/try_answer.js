const { fileExists, isDirectory } = require('./helpers')

const { answerDynamical } = require('./../answers/answer_dynamic_file')

const { sendError } = require('./../answers/answer_error')

const { sendStaticFile } = require('./../answers/answer_static_file')



async function tryDynamicFileAnswer(filePath, response, request) {
// Return null, if no dynamic file was found.
// If a dynamic file was found and loading it errors, send error,
// otherwise execute and return handleDynamicAnswer upon the
// loaded answer.


  if( ! fileExists(filePath + '.js') ) return null

  let dynamicAnswer = null

  try {

    dynamicAnswer = require(filePath)

  }

  catch(error) {

    sendError(response, error)

    return true

  }

  return answerDynamical(request, response, dynamicAnswer)

}



function tryServerSideEventAnswer(request, response, paras) {
// Load sse-file if it exists and excecute the expected
// exported main-function of it upon request and response.

  let filePath = paras.filePath + '.sse'

  if( ! fileExists(filePath) ) return

  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  require(filePath).main(request, response)

}



function tryStaticFileAnswer(response, filePath) {
// If filePath does not exist, or is a directory, return false.
// If no contentType can be found, answer with help message and return true.
// Otherwise send static file and return true.


  if( ! fileExists(filePath) || isDirectory(filePath) ) {

    return false

  }

  sendStaticFile(filePath, response)

  return true

}



module.exports = {

  tryDynamicFileAnswer: tryDynamicFileAnswer,

  tryServerSideEventAnswer: tryServerSideEventAnswer,

  tryStaticFileAnswer: tryStaticFileAnswer,

}
