const fs = require('fs')

const path = require('path')

const getContentType = require('./types').getContentType


const fileExists = filePath => { return fs.existsSync(filePath) }

const fileIsDirectory = fPath => { return fs.statSync(fPath).isDirectory() }

const readFile = filePath => { return fs.readFileSync(filePath, 'utf-8') }


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

  response.writeHead(statusCode, responseHead)

  response.end(answer)

}


function answerIndexlessDirectory(response) {

  let answer = "This folder doesn't have an index-file."

  sendAnswer(response, answer, 'text/html')

}


function answerNotFound(requestedPath, response) {

  let answer = 'Nothing found for ' + requestedPath

  sendAnswer(response, answer, 'text/html', '404')

}


function tryStaticAnswer(filePath, response) {

  if(fileExists(filePath) && ! fileIsDirectory(filePath)) {

    let answer = readFile(filePath)

    let extension = path.parse(filePath).ext.slice(1)

    let contentType = getContentType(extension)

    sendAnswer(response, answer, contentType)

    return true

  }

}


async function tryDynamicAnswer(filePath, response, request, RELOAD) {

  if( ! fileExists(filePath + '.js')) return

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

  // If it returned a function, execute it upon request:

  if(typeof(dynamicAnswer) == 'function') {

    try {

      dynamicAnswer = await dynamicAnswer(request)

    }

    catch(error) {

      console.log(genCouldNotLoadError(filePath), error)

    }

  }

  // If function returned a string, send it as answer:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(response, dynamicAnswer, contentType='text/html')

    return true

  }

}


module.exports = {
  answerIndexlessDirectory: answerIndexlessDirectory,
  answerNotFound: answerNotFound,
  tryStaticAnswer: tryStaticAnswer,
  tryDynamicAnswer: tryDynamicAnswer
}
