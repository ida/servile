const isDirectory = require('is-directory').sync

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

module.exports = {
  isDirectory: isDirectory,
  parseData: parseData
}
