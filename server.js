// IMPORTS:

const fs = require('fs')

const http = require('http')

const path = require('path')

const getContentType = require('./types').getContentType


// PARAMETERS:

let filesPath = process.cwd()

let port = 3000

let RELOAD = true


// GLOBALS:

let loadModule = require

if(RELOAD) {
  try {
    loadModule = require('require-reload')
  }
  catch(e) {
    console.debug('\nReload-mode is on, but "require-reload" is not installed.')
  }
}


// GENERAL HELPERS:

const fileExists = filePath => { return fs.existsSync(filePath) }

const fileIsDirectory = fPath => { return fs.lstatSync(fPath).isDirectory() }

const readFile = filePath => { return fs.readFileSync(filePath, 'utf-8') }


// SPECIFIC HELPERS:

const parseData = data => {

  data = Buffer.concat(data).toString()

  // For some reason spaces are replaced with plus signs,
  // let's turn that back again:
  data = data.split('+').join(' ')

  let pairs = data.split('&')

  data = {}

  for(let pair of pairs) {

    let key = pair.split('=')[0]

    let val = decodeURIComponent(pair.split('=')[1])

    data[key] = val

  }

  return data

}


const onRequest = (request, response) => {

  let answer, dynamicAnswer, extension, filePath, requestedPath, statusCode;

  let contentType = 'text/html'

  // If user filled out and submitted a form, chunks of data are sended
  // from the client to server. Collect them:
  let data = []; request.on('data', chunk => data.push(chunk))

  // When the request has finished, all data is sended and we can ...
  request.on('end', async () => {

    // ... make all received data-chunks an object of key-value-pairs
    // and attach it to the request, for possible further processing
    // by other functions, if there is any data, otherwise skip ...
    if(data != '') request.data = parseData(data)

    // ... and search for an answer to send as reponse:
    requestedPath = request.url

    filePath = filesPath + requestedPath

    // Case 1: Filepath has an extension and exists, serve it:
    if(fileExists(filePath) && ! fileIsDirectory(filePath)) {
      answer = readFile(filePath)
      extension = path.parse(filePath).ext.slice(1)
      contentType = getContentType(extension)
      sendAnswer(response, answer, contentType)
      return // abort further code-execution
    }

    // Filepath has not an extension and exists and is a
    // directory: Append 'index' to filePath and regard
    // directory could contain a directory named 'index':
    while( fileExists(filePath) && fileIsDirectory(filePath) ) {
      filePath += 'index'
      // Provide a fallback-answer for directories:
      answer = "This folder doesn't have an index-file."
    }

    // Filepath is extensionless, check if a JS-file of same name exists:
    if(fileExists(filePath + '.js')) {

      // It does, load it:
      dynamicAnswer = loadModule(filePath)

      // A function was returned, execute it upon request:
      if(typeof(dynamicAnswer) == 'function') {
        dynamicAnswer = await dynamicAnswer(request)
      }
    
      // Case 2: An string was returned, send it:
      if(typeof(dynamicAnswer) == 'string') {
        sendAnswer(response, dynamicAnswer, contentType)
        return
      }

    }

    // Case 3: A JSON-file of same name exists, return JSON-object:
    if(fileExists(filePath + '.json')) {
      answer = readFile(filePath + '.json')
      contentType = 'application/json'
      sendAnswer(response, answer, contentType)
      return
    }

    // Case 4: An HTML-file of same name exists, return it:
    if(fileExists(filePath + '.html')) {
      answer = readFile(filePath + '.html')
      sendAnswer(response, answer, contentType)
      return
    }

    // Case 5: Ain't got no answer:
    if( ! answer ) {
      answer = 'Nothing found for ' + requestedPath
      statusCode = 404
      sendAnswer(response, answer, contentType, statusCode)
      return
    }

    // Case 6: Fallback answer for directories:
    sendAnswer(response, answer, contentType, statusCode)

	}); // request.on('end')

}


const sendAnswer = (response, answer, contentType, statusCode=200) => {

  let responseHead = { 'Content-Type': contentType + '; charset="utf-8"' }
  responseHead['Access-Control-Allow-Origin'] = '*'
  responseHead['Access-Control-Allow-Headers'] = 
    'Origin, X-Requested-With, Content-Type, Accept'

  response.writeHead(statusCode, responseHead)

  response.end(answer)

}


const server = http.createServer(onRequest)


server.serve = () => {

  server.listen(port, () => {

    console.log(`
Serving "${filesPath}" on "http://localhost:${port}"
`    )

  })
}


module.exports = server
