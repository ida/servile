const { genHtml } = require('./../logic/helpers')

const { sendAnswer } = require('./../logic/send_answer')



function answerError(response, error) {

  let answer = ''

  answer += '<pre>'

  answer += error.stack

  answer += '</pre>'

  answer = genHtml(answer)

  sendAnswer(response, answer)

}



module.exports = {

  answerError: answerError,

}
