const { answerIndexlessDirectory,

        answerNotFound,

        tryStaticAnswer, 

        tryDynamicAnswer } = require('./answer_request.js')

const { isDirectory }      = require('./helpers.js')


async function findAnswer(request, response, filesPath, RELOAD) {

  let IS_DIR = false

  let requestedPath = request.url

  let filePath = filesPath + requestedPath

  if(tryStaticAnswer(filePath, response)) return

  if(isDirectory(filePath)) {
    IS_DIR = true
    if( ! filePath.endsWith('/') ) filePath += '/'
    filePath += 'index'
  }

  if(await tryDynamicAnswer(filePath, response, request, RELOAD)) return

  if(tryStaticAnswer(filePath + '.html', response)) return

  if(tryStaticAnswer(filePath + '.json', response)) return

  if(IS_DIR) answerIndexlessDirectory(response)

  else answerNotFound(requestedPath, response)

}


module.exports.findAnswer = findAnswer
