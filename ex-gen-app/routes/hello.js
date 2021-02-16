var express = require('express');
var router = express.Router();
const http = require('https');
const parseString = require('xml2js').parseString
const sqlite3 = require('sqlite3')
const {check, validationResult} = require('express-validator')


const db = new sqlite3.Database('mydb.sqlite3')

router.get('/find', (req,res) => {
  db.serialize(() => {
    db.all("SELECT * FROM mydata", (err, rows) =>{
      if(!err) {
        var data = {
          title: 'hello/find page',
          find: '',
          content: '検索条件を入力してね',
          mydata: rows
        }
        res.render('hello/find', data)
      }
    })
  })
})

router.post('/find', (req, res) => {
  const find = req.body.find
  db.serialize(() => {
    let q = "SELECT * FROM mydata WHERE " // need space after 'where'
    db.all(q + find, [], (err, rows) => {
      console.log(q, find, )
      if(!err) {
        var data = {
          title: 'hello/find page',
          find: find,
          content: '条件' + find + 'で検索した結果',
          mydata: rows
        }
      }
      res.render('hello/find', data)
    })
  })
})


router.get('/delete', (req, res) => {
  const id = req.query.id
  const q = "SELECT * FROM mydata WHERE id = ?"
  db.serialize(() => {
    db.get(q, [id], (err, row) => {
      console.log(err)
      if(!err) {
        var data = {
          title: 'hello/delete',
          content: `id = ${id} の削除ページ`,
          mydata: row 
        }
      }
      res.render('hello/delete', data)
    })
  })
})

router.post('/delete', (req, res) => {
  const id = req.body.id
  const q = "DELETE FROM mydata WHERE id = ?"
  db.serialize(() =>{
    db.run(q, id)
  })
  res.redirect('/hello')
})

router.get('/edit', (req, res) => {
  const id = req.query.id
  db.serialize(() => {
    const q = "SELECT * FROM mydata WHERE id = ?"
    db.get(q, [id], (err, row) => {
      if(!err) {
        var data = {
          title: 'hello/edit',
          content: `id = ${id} のrecordを編集`,
          mydata: row
        }
        res.render('hello/edit', data)
      }
    })
  })
})

router.post('/edit', (req, res) => {
  const id = req.body.id
  const nm = req.body.name
  const ml = req.body.mail
  const ag = req.body.age
  const q = "UPDATE mydata SET name = ?, mail = ?, age = ? WHERE id = ?"
  db.serialize(() => {
    db.run(q, nm, ml, ag, id)
  })
  res.redirect('/hello')
})

// router.get('/show', (req, res) => {
//   const id = req.query.id
//   console.log([id])
//   db.serialize(() => {
//     const q = "SELECT * FROM mydata WHERE id = ?"
//     db.get(q, [id], (err, row) => {
//       if(!err) {
//         var data = {
//           title: ' hello/show',
//           content: `id = ${id} のレコードです`,
//           mydata: row
//         }
//         res.render('hello/show', data)
//       }
//     })
//   })
// })

//use express-validator
router.get('/add', (req, res) => {
  var data = {
    title: 'Hello/add',
    content: '新しいコードを入力',
    form: {name: '', mail: '', age: 0}
  }
  res.render('hello/add', data)
})

router.post('/add', [
  check('name').notEmpty().escape(),
  check('mail', 'メールアドレスの形式が不正です。').isEmail(),
  check('age', '年齢は整数で').isInt(),
],
(req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    var result = '<ul class="text-danger">'
    var result_arr = errors.array()
    console.log('result_arr no nakami')
    console.dir(result_arr)
    for (var n in result_arr) {
      result += `<li>${result_arr[n].msg}</li>`
    }
    result += '</ul>'
    var data = {
      title: 'hello/add',
      content: result,
      form: req.body
    }
    res.render('hello/add', data)
  } else {
    var nm = req.body.name
    var ml = req.body.mail
    var age = req.body.age
    db.serialize(() => {
      db.run('INSERT INTO mydata (name, mail, age) values (?, ?, ?)', nm, ml, age)
    })
    res.redirect('/hello')
  }
})



// router.get('/add', (req, res) => {
//   var data = {
//     title: 'this is Hello/Add',
//     content: '追加したいレコードを入力'
//   }
//   res.render('hello/add', data)
// })

// router.post('/add', (req, res) => {
//   const nm = req.body.name
//   const ml = req.body.mail
//   const ag = req.body.age
//   db.serialize(() => {
//     console.log('a')
//     db.run('insert into mydata (name, mail, age) values (?, ?, ?)', [nm, ml, ag])
//     console.log('b')
//   })
//   console.log('c')
//   res.redirect('/hello')
// })

router.get('/', (req, res) => {
  db.serialize(() => {
    var rows = "";
    db.each("select * from mydata", (err, row) => {
      if(!err) {
        rows += `<tr><th>${row.id}</th><td>${row.name}</td><td>${row.mail}</td><td>${row.age}</td></tr>`
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
