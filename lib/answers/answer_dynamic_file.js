const { sendAnswer } = require('./../logic/send_answer')

const { sendError } = require('./answer_error')



async function answerDynamical(request, response, dynamicAnswer) {

  let contentType = 'text/html'

  // If dynamicAnswer is a function, execute it upon request and response:

  if(typeof(dynamicAnswer) == 'function') {

    try {

      dynamicAnswer = await dynamicAnswer(request, response)

    }

    // If an error ocurred, send it and abort:

    catch(error) {

      sendError(response, error)

      return true

    }

  }


  // If dynamicAnswer is a dict or list, send it as JSON and abort:

  if(typeof dynamicAnswer == 'object' && dynamicAnswer !== null) {
  if(dynamicAnswer.constructor
  && dynamicAnswer.constructor.name == 'Object'
  || dynamicAnswer.constructor.name == 'Array') {

    dynamicAnswer = JSON.stringify(dynamicAnswer)

    contentType = 'application/json'

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  } }


  // If dynamicAnswer is a string, send it as HTML and abort:

  if(typeof(dynamicAnswer) == 'string') {

    sendAnswer(response, dynamicAnswer, contentType)

    return true

  }


  // Otherwise do nothing.


}



module.exports = {

  answerDynamical: answerDynamical

}
