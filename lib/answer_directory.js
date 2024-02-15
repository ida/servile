const fs = require('fs')

const path = require('path')



function answerDirectory(req, filesPath) {
//
//  Return html for directory list.
//

  let html = ''

  let filePath = req.url

  // Add link to this directory:

  html += '<div><a href="' + filePath + '"' + '>' + filePath + '</a></div>'

  // Add link to parent directory:

  html += '<div><a href="' + path.dirname(filePath) + '"' + '>..</a></div>'

  // Get the filesPath the OS needs:

  filesPath = path.resolve(filesPath, filePath.slice(1))

  // Read children:

  const fileNames = fs.readdirSync(filesPath)

  // Add links to children:

  for(let fileName of fileNames) {

    let filePath = req.url

    if(filePath != '/') filePath += '/'

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
