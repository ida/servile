const { genHtml } = require('./../logic/helpers')


module.exports = req => {

  let html = ''

  html += '<p>Nothing found for ' + req.url + '</p>'

  html += '<p>Go <a href="/">home</a></p>'

  return genHtml(html)

}
