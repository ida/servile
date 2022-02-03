const path = require('path')

const { fileExists, genHtml, isDirectory, readFile } = require('./helpers')


function genCouldNotExecuteError(filePath) {

  return `
In ${__filename} executing the function loaded from ${filePath} failed with:
`

}


function genCouldNotLoadError(filePath) {

  return `
In ${__filename} loading ${filePath} failed with:
`

}


function handleError(error) {


  return true

}


function sendAnswer(request, response, answer, contentType, statusCode=200) {

  let responseHead = { 'Content-Type': contentType + '; charset="utf-8"' }

  responseHead['Access-Control-Allow-Origin'] = '*'

  responseHead['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

  // Redirect to where we're coming from (takes only effect, if statusCode
  // starts with 3):
  responseHead['Location'] = request.url

  // Make redirect take effect, if data was posted, so on a browser-reload,
  // no re-posting happens (PRG-pattern):
  if(request.data) statusCode = 303

  response.writeHead(statusCode, responseHead)

  response.end(answer)

}


async function answerIndexlessDirectory(answerDirectory, request, response) {

  try {

  let answer = await answerDirectory(request, response)

  sendAnswer(request, response, answer, 'text/html')

  } catch(e) { console.error(e) }

}


async function answerNotFound(customAnswerNotFound, request, response) {

  try {

    let answer = await customAnswerNotFound(request, response)

    sendAnswer(request, response, answer, 'text/html', '404')

  } catch(e) { console.error(e) }

}


async function tryDynamicAnswer(filePath, response, request) {
// Return null, if no dynamic file was found.
// Return true, if an answer was found.
// Otherwise don't return anything.

  // If there is no dynamic file, abort:

  if( ! fileExists(filePath + '.js') ) return null


  let contentType = 'text/html'

  let dynamicAnswer = null


  // Load file:

  try {

    dynamicAnswer = require(filePath)

  }

  catch(error) {

    dynamicAnswer = genCouldNotLoadError(filePath) + '\n' + error

    console.log(dynamicAnswer)

    dynamicAnswer = genHtml(dynamicAnswer)

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  }

  // If it returned a function, execute it upon request and response:

  if(typeof(dynamicAnswer) == 'function') {

    try {

      dynamicAnswer = await dynamicAnswer(request, response)

    }

    catch(error) {

      dynamicAnswer = genCouldNotExecuteError(filePath) + '\n' + error

      console.log(genCouldNotExecuteError(filePath), error)

      sendAnswer(request, response, dynamicAnswer, contentType)

      return true

    }

  }


  // If we got a dict or list, send it as JSON:

  if(typeof dynamicAnswer == 'object' && dynamicAnswer !== null) {
  if(dynamicAnswer.constructor
  && dynamicAnswer.constructor.name == 'Object'
  || dynamicAnswer.constructor.name == 'Array') {

    dynamicAnswer = JSON.stringify(dynamicAnswer)

    contentType = 'application/json'

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  } }


  // If we got a string, send it as answer:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  }

  // Otherwise do nothing.

}


module.exports = {
  answerIndexlessDirectory: answerIndexlessDirectory,
  answerNotFound: answerNotFound,
  tryDynamicAnswer: tryDynamicAnswer
}
