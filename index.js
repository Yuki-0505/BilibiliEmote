const request = require('request')
const fs = require('fs')
const path = require('path')
const { resolveCname } = require('dns')

/**
 * parseUrlFromHtml(filePath: string, callback: (err: Error, data: Array<{title: string, url: string}>) => void): void
 */
function parseUrlFromHtml(filePath, callback) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return callback(err)
    }
    let titles = data.match(/title="\[[\u4e00-\u9fa5\w]+\]"/g)
    let urls = data.match(/url\(\&quot;[\w\/\.]+\&quot;\)/g)
    let emojis = []
    for (let i = 0, len = titles.length; i < len; i++) {
      emojis.push({
        title: titles[i].slice(8, -2),
        url: 'https:' + urls[i].slice(10, -7)
      })
    }
    return callback && callback(null, emojis)
  })
}

/**
 * saveEmojiByUrl(url: string, callback: err => void): void
 */
function saveEmojiByUrl(emoji, callback) {
  request({
    url: emoji.url,
    method: 'GET',
    encoding: null,
    header: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68'
    }
  }, (err, res, body) => {
    if (err) {
      return callback(err)
    }
    let fileName = path.join(__dirname, '/public', '/img', emoji.title.trim() + path.extname(emoji.url))
    fs.writeFile(fileName, body, callback)
  })
}

function save(htmlFileName) {
  parseUrlFromHtml(path.join(__dirname, './public/html', htmlFileName), (err, data) => {
    if (err) {
      return console.log('parse url error...')
    }
    for (let emoji of data) {
      saveEmojiByUrl(emoji, err => {
        if (err) {
          return console.log('error.')
        }
      })
    }
  })
}

function main() {
  save('hot_words.html')
  save('tv.html')
}

main()
