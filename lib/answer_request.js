const path = require('path')

const { fileExists, genHtml, isDirectory, readFile } = require('./helpers')


function genNoAnswerWarning(filePath) {

  return `In "${__filename}"
executing the function loaded from
"${filePath}"
returned undefined, which may not be what you want.
If this is intended, let the dynamic file return null,
then a 404-not-found is sended, instead of this message.
`

}


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


  // If there is no dynamic file, abort:

  if( ! fileExists(filePath + '.js') ) return


  let contentType = 'text/html'

  let dynamicAnswer = undefined


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

  // If we got an object, send it as JSON:

  if(typeof(dynamicAnswer) == 'object') {

    dynamicAnswer = JSON.stringify(dynamicAnswer)

    contentType = 'application/json'

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  }

  // If we got a string, send it as answer:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  }


  // If dynamicAnswer is undefined, send warning:

  if(dynamicAnswer !== null) {

    dynamicAnswer = genHtml(genNoAnswerWarning(filePath))

    sendAnswer(request, response, dynamicAnswer, contentType)

    return true

  }

}


module.exports = {
  answerIndexlessDirectory: answerIndexlessDirectory,
  answerNotFound: answerNotFound,
  tryDynamicAnswer: tryDynamicAnswer
}
