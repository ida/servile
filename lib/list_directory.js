const fs = require('fs')


function getChildrenFileNames(directoryPath) {

  return fs.readdirSync(directoryPath)

}


function isDirectory(filePath) {

  return fs.statSync(filePath).isDirectory()

}


function genListItemHtml(fileName) {

  let html = '<li>'

    html += '<a href="' + fileName + '">'

      html += fileName

    html += '</a>'

  html += '</li>'

  return html

}


function genDirectoryListHtml(request) {

  let html = '<ol>'

  const fileNames = getChildrenFileNames(process.cwd() + request.url)


  if(request.url != '/') {

    html += genListItemHtml('..')

  }


  for(let fileName of fileNames) {

    html += genListItemHtml(fileName)

  }


  html += '</ol>'

  return html

}



module.exports.genDirectoryListHtml = genDirectoryListHtml
