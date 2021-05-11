const { answerIndexlessDirectory,

        answerNotFound,

        tryStaticAnswer, 

        tryDynamicAnswer } = require('./answer_request.js')

const { fileExists,

        isDirectory }      = require('./helpers.js')


async function findAnswer(request, response, paras) {

  let IS_DIR = false

  let requestedPath = request.url

  let filePath = paras.filesPath + requestedPath

  if(tryStaticAnswer(filePath, response)) return

  if(fileExists(filePath) && isDirectory(filePath)) {

    IS_DIR = true

    if( ! filePath.endsWith('/') ) filePath += '/'

    filePath += 'index'

  }

  if(await tryDynamicAnswer(filePath, response, request, paras.RELOAD)) return

  if(tryStaticAnswer(filePath + '.html', response)) return

  if(tryStaticAnswer(filePath + '.json', response)) return

  if(IS_DIR) answerIndexlessDirectory(paras.answerDirectory, request, response)

  else answerNotFound(paras.answerNotFound, request, response)

}


module.exports.findAnswer = findAnswer
