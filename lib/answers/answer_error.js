const { genHtml } = require('./../logic/helpers')

const { sendAnswer } = require('./../logic/send_answer')



function sendError(response, error) {

  let answer = ''

  answer += '<pre>'

  answer += error.stack

  answer += '</pre>'

  answer = genHtml(answer)

  sendAnswer(response, answer)

}



module.exports = {

  sendError: sendError,

}
