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


function sendAnswer(response, answer, contentType, statusCode=200) {

  let responseHead = { 'Content-Type': contentType + '; charset="utf-8"' }

  responseHead['Access-Control-Allow-Origin'] = '*'

  responseHead['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

  responseHead['Permissions-Policy'] = 'interest-cohort=()' // FLoC off!

  response.writeHead(statusCode, responseHead)

  response.end(answer)

}


function answerIndexlessDirectory(answerDirectory, request, response) {

  let answer = answerDirectory(request)

  sendAnswer(response, answer, 'text/html')

}


function answerNotFound(customAnswerNotFound, request, response) {

  let answer = customAnswerNotFound(request)

  sendAnswer(response, answer, 'text/html', '404')

}


function tryStaticAnswer(filePath, response) {

  if(fileExists(filePath) && ! isDirectory(filePath)) {

    let answer = readFile(filePath)

    let extension = path.parse(filePath).ext.slice(1)

    let contentType = getContentType(extension)

    sendAnswer(response, answer, contentType)

    return true

  }

}


async function tryDynamicAnswer(filePath, response, request, RELOAD) {

  
  // If there is no dynamic file, abort:
 
  if( ! fileExists(filePath + '.js') ) return


  let contentType = 'text/html'

  let dynamicAnswer = null

  let loadModule = require

 
  if(RELOAD) {

    try {

      loadModule = require('require-reload')

    }

    catch(error) {

      console.log('\nReload-mode is on, but "require-reload" is not installed.')

    }

  }

  // Load file:

  try {

    dynamicAnswer = loadModule(filePath)

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

      console.log(genCouldNotLoadError(filePath), error)

    }

  }

  // Finally if we got a string, send it as answer:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  }

}


module.exports = {
  answerIndexlessDirectory: answerIndexlessDirectory,
  answerNotFound: answerNotFound,
  tryStaticAnswer: tryStaticAnswer,
  tryDynamicAnswer: tryDynamicAnswer
}
