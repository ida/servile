const fs = require('fs')

const fileExists = path => { return fs.existsSync(path) }

const genHtml = html => {

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @media (prefers-color-scheme: dark) {
      :root {
        background: rgb(28,27,34);
        color: rgb(251,251,254)
      }
    }
  </style>
</head>
<body>

${html}

</body>
</html>`

}


const isDirectory = path => { const file = fs.statSync(path); return file.isDirectory(path) }

const parseData   = data => {

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

const readFile = path => { return fs.readFileSync(path, 'utf-8') }

module.exports = {
  fileExists: fileExists,
  genHtml: genHtml,
  isDirectory: isDirectory,
  parseData: parseData,
  readFile: readFile
}
