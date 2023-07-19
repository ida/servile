const fs = require('fs')

const path = require('path')

const contentTypes = require('./content_types.js')

const { fileExists, genHtml, isDirectory } = require('./helpers')



async function handleDynamicAnswer(request, response, dynamicAnswer) {

  let contentType = 'text/html'

  // If dynamicAnswer is a function, execute it upon request and response:

  if(typeof(dynamicAnswer) == 'function') {

    try {

      dynamicAnswer = await dynamicAnswer(request, response)

    }

    // If an error ocurred, send it and abort:

    catch(error) {

      sendError(response, error)

      return true

    }

  }


  // If dynamicAnswer is a dict or list, send it as JSON and abort:

  if(typeof dynamicAnswer == 'object' && dynamicAnswer !== null) {
  if(dynamicAnswer.constructor
  && dynamicAnswer.constructor.name == 'Object'
  || dynamicAnswer.constructor.name == 'Array') {

    dynamicAnswer = JSON.stringify(dynamicAnswer)

    contentType = 'application/json'

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  } }


  // If dynamicAnswer is a string, send it as HTML and abort:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  }


  // Otherwise do nothing.


}



function sendAnswer(response, answer, contentType='text/html', statusCode=200) {

  let responseHead = { 'Content-Type': contentType + '; charset="utf-8"' }

  responseHead['Access-Control-Allow-Origin'] = '*'

  responseHead['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

  response.writeHead(statusCode, responseHead)

  response.end(answer)

}



function sendError(response, error) {

  let answer = ''

  answer += '<pre>'

  answer += error.stack

  answer += '</pre>'

  answer = genHtml(answer)

  sendAnswer(response, answer)

}



async function tryDynamicAnswer(filePath, response, request) {
// Return null, if no dynamic file was found.
// Return true, if a dynamic file was found.
// Otherwise don't return anything.

  if( ! fileExists(filePath + '.js') ) return null


  let dynamicAnswer = null


  // Load file:

  try {

    dynamicAnswer = require(filePath)

    return handleDynamicAnswer(request, response, dynamicAnswer)

  }

  catch(error) {

    sendError(response, error)

    return true

  }

}



function tryStaticAnswer(response, filePath) {
// If filePath does not exist, or is a directory, return false.
// If no contentType can be found, answer with help message and return true.
// Otherwise send static file and return true.


  if( ! fileExists(filePath) || isDirectory(filePath) ) {

    return false

  }

  const extension = path.extname(filePath).slice(1)

  const contentType = contentTypes[extension]

  let answer = 'Could not find a contentType for "' + filePath + '".'

  answer = genHtml(answer)

  if(contentType) answer = fs.readFileSync(filePath, 'utf8')

  sendAnswer(response, answer)

  return true

}



module.exports = {
  answerIndexlessDirectory: answerIndexlessDirectory,
  answerNotFound: answerNotFound,
  handleDynamicAnswer: handleDynamicAnswer,
  tryDynamicAnswer: tryDynamicAnswer,
  tryStaticAnswer: tryStaticAnswer,
  sendAnswer: sendAnswer
}
