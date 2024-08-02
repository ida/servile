const fs = require('fs')

const path = require('path')

const contentTypes = require('./../logic/content_types.js')



function sendStaticFile(filePath, res) {

  fs.readFile(filePath, (err, data) => {

    if(err) {

      res.writeHead(404, { 'Content-Type': 'text/html' })

      res.end('Could not read file "' + filePath + '" ', err)

    } else {

      const extension = path.extname(filePath).slice(1).toLowerCase()

      const type = contentTypes[extension]

      if(type === undefined) {

        res.writeHead(404, { 'Content-Type': 'text/html' })

        res.end('Content-type for "' + filePath + '" not found')

      }

      else {

        res.writeHead(200, { 'Content-Type': type })

        res.end(data)

      }

    }

  })

}



module.exports = {

  sendStaticFile: sendStaticFile,

}
