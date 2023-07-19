const fs = require('fs')

const path = require('path')

const contentTypes = require('./content_types.js')

const { fileExists, genHtml, isDirectory } = require('./helpers')



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


function sendAnswer(response, answer, contentType='text/html', statusCode=200) {

  let responseHead = { 'Content-Type': contentType + '; charset="utf-8"' }

  responseHead['Access-Control-Allow-Origin'] = '*'

  responseHead['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

  response.writeHead(statusCode, responseHead)

  response.end(answer)

}


async function answerIndexlessDirectory(answerDirectory, request, response) {

  try {

  let answer = await answerDirectory(request, response)

  sendAnswer(response, answer, 'text/html')

  } catch(e) { console.error(e) }

}


async function answerNotFound(customAnswerNotFound, request, response) {

  try {

    let answer = await customAnswerNotFound(request, response)

    sendAnswer(response, answer, 'text/html', '404')

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

    dynamicAnswer = genCouldNotLoadError(filePath) + '\n' + JSON.stringify(new Error(error))

    dynamicAnswer = genHtml(dynamicAnswer)

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  }

  // If it returned a function, execute it upon request and response:

  if(typeof(dynamicAnswer) == 'function') {

    try {

      dynamicAnswer = await dynamicAnswer(request, response)

    }

    catch(error) {

      dynamicAnswer = genCouldNotExecuteError(filePath) + '\n' + error

      sendAnswer(response, dynamicAnswer, contentType)

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

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  } }


  // If we got a string, send it as answer:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  }

  // Otherwise do nothing.

}



function tryStaticAnswer(response, filePath) {

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
  tryDynamicAnswer: tryDynamicAnswer,
  tryStaticAnswer: tryStaticAnswer,
  sendAnswer: sendAnswer
}
