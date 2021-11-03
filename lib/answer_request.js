const path = require('path')

const getContentType = require('./types').getContentType

const { fileExists, isDirectory, readFile } = require('./helpers')


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


function sendAnswer(request, response, answer, contentType, statusCode=200) {

  let responseHead = { 'Content-Type': contentType + '; charset="utf-8"' }

  responseHead['Access-Control-Allow-Origin'] = '*'

  responseHead['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

  // Do not allow the chrome-browser to collect even more user data (FLoC):
  responseHead['Permissions-Policy'] = 'interest-cohort=()'

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

  let answer = await answerDirectory(request, response)

  sendAnswer(request, response, answer, 'text/html')

}


async function answerNotFound(customAnswerNotFound, request, response) {

  let answer = await customAnswerNotFound(request, response)

  sendAnswer(request, response, answer, 'text/html', '404')

}


async function tryDynamicAnswer(filePath, response, request) {


  // If there is no dynamic file, abort:

  if( ! fileExists(filePath + '.js') ) return


  let contentType = 'text/html'

  let dynamicAnswer = null


  // Load file:

  try {

    dynamicAnswer = require(filePath)

  }

  catch(error) {

    console.log(genCouldNotLoadError(filePath), error)

  }

  // If it returned a function, execute it upon request and response:

  if(typeof(dynamicAnswer) == 'function') {

    try {

      dynamicAnswer = await dynamicAnswer(request, response)

    }

    catch(error) {

      console.log(genCouldNotExecuteError(filePath), error)

    }

  }

  // Finally if we got a string, send it as answer:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  }

}


module.exports = {
  answerIndexlessDirectory: answerIndexlessDirectory,
  answerNotFound: answerNotFound,
  tryDynamicAnswer: tryDynamicAnswer
}
