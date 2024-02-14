const fs = require('fs')

const path = require('path')



function answerDirectory(req, filesPath) {


  let html = '<h2>' + req.url + '</h2>\n'

  html += '<div><a href=".."' + '>..</a></div>'


  filesPath = path.resolve(

    filesPath,

    req.url.slice(1)

  )


  const fileNames = fs.readdirSync(filesPath)

  for(let fileName of fileNames) {

    let filePath = req.url

    if(req.url != '/') filePath += '/'

    filePath += fileName

    html += '\n<div>'

    html += '<a href="' + filePath + '">' + fileName

    html += '</a>'

    html += '</div>'

  }

  return html

}



module.exports = {

  answerDirectory: answerDirectory

}
