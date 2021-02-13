const request = require('request')
const fs = require('fs')
const path = require('path')

const parseUrl = require('./parseUrl')

function getImageByUrl(url) {
  request({
    url: url,
    method: 'GET',
    encoding: null,
    header: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68'
    }
  }, (err, res, body) => {
    if(err) {
      return console.log('request error.')
    }
    fs.writeFile(path.join(__dirname, '/public', '/img', path.basename(url)), body, err => {
      if (err) {
        console.log('write file error.')
      }
    })
  })
}

getImageByUrl('https://i0.hdslb.com/bfs/emote/48f75163437445665a9be80bb316e4cb252c5415.gif')
