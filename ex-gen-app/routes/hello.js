var express = require('express');
var router = express.Router();
const http = require('https');
const parseString = require('xml2js').parseString
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('mydb.sqlite3')

router.get('/add', (req, res) => {
  var data = {
    title: 'this is Hello/Add',
    content: '追加したいレコードを入力'
  }
  res.render('hello/add', data)
})

router.post('/add', (req, res) => {
  const nm = req.body.name
  const ml = req.body.mail
  const ag = req.body.age
  db.serialize(() => {
    console.log('a')
    db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag)
    console.log('b')
  })
  console.log('c')
  res.redirect('/hello')
})

router.get('/', (req, res) => {
  db.serialize(() => {
    var rows = "";
    db.each("select * from mydata", (err, row) => {
      if(!err) {
        rows += `<tr><th>${row.id}</th><td>${row.name}</td><td>${row.age}</td></tr>`
      }
    }, (err, count) => {
      if(!err) {
        var data = {
          title: 'Hellooo',
          content: rows
        }
      }
      res.render('hello/index', data)
    })
  })
})

// router.get('/', (req, res) => {
//   var opt = {
//     host: 'news.google.com',
//     port: 443,
//     path: '/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=JP&ceid=JP:ja'
//   }
//   http.get(opt, (res2) => {
//     var body = '';
//     res2.on('data', (data) => {
//       body += data;
//     });
//     res2.on('end', () => {
//       parseString(body.trim(), (err, result) => {
//         console.dir(result.rss.channel[0])
//         var data = {
//           title: result.rss.channel[0].description,
//           content: result.rss.channel[0].item
//         }
//         res.render('hello', data)
//       })
//     })
//   })
// })

// router.get('/', function(req, res, next) {
//   var msg = 'なにか書いて送信してね'
//   if(req.session.message != undefined) {
//     msg = "最後のメッセージは " + req.session.message + " でした！";
//   }
//   const data = {
//     title: 'Express Hello page',
//     content: msg
//   }
//   res.render('hello', data);
// });

router.post('/post', (req, res, nex) => {
  // const msg = req.query.message
  const msg = req.body['message']
  req.session.message = msg
  const msg2 = req.body['msg2']
  const data = {
    title: 'received!!',
    content: `最後のメッセージは ${req.session.message} ですね。`
  }
  res.render('hello', data)
})

module.exports = router;
