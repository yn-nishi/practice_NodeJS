var express = require('express');
var router = express.Router();
const db = require('../models')
const { Op } = require('sequelize')

router.get('/login', (req, res) => {
  var data = {
    title:'Users/Login',
    content:'名前とパスワードを入力下さい。'
  }
  res.render('users/login', data)
})


router.get('/delete', (req, res) => {
  db.User.findByPk(req.query.id)
  .then((usr) => {
    const data = {
      title: 'users/delete',
      form: usr
    }
    res.render('users/delete', data)
  })
})

router.post('/delete', (req, res) => {
  db.User.findByPk(req.body.id)
  .then((user) => {
    user.destroy()
    .then(() => {
      res.redirect('/users')
    })
  })
})

// router.post('/delete', (req, res) => {
//   db.sequelize.sync()
//     .then(() => db.User.destroy(
//       {
//       where: {id: req.body.id}
//       }
//     ))
//     .then((usr) => {
//       res.redirect('/users')
//     })
// })

router.get('/edit', (req, res) => {
  db.User.findByPk(req.query.id)
  .then(user => {
    const data = {
      title: 'users/edit',
      form: user
    }
    res.render('users/edit', data)
  })
})

router.post('/edit', (req, res) => {
  console.log('req.body.id',req.body.id)
  db.User.findByPk(req.body.id)
  .then((usr) => {
    usr.name = req.body.name
    usr.pass = req.body.pass
    usr.mail = req.body.mail
    usr.age = req.body.age
    usr.save()
    .then(()=>{
      res.redirect('/users')
    })
  })
})

// router.post('/edit', (req, res) => {
//   db.sequelize.sync()
//   .then(() => {
//     db.User.update(
//       {
//         name: req.body.name,
//         pass: req.body.pass,
//         mail: req.body.mail,
//         age: req.body.age
//       },
//       {
//         where: {id: req.body.id}
//       }
//     )
//   })
//   .then(() => {
//     res.redirect('/users')
//   })
// })

router.get('/add', (req, res) => {
  var data = {
    title: 'Users/Add',
    form: new db.User(),
    err:null
  }
  res.render('users/add', data);
})

router.post('/add', (req, res) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  };
  db.sequelize.sync()
  .then(() => {
    db.User.create(form)
    .then(() => {
      res.redirect('/users')
    })
    .catch((err) => {
      var data = {
        title: 'Users/Add',
        form: form,
        err: err
      }
      res.render('users/add', data)
    })
  })
})


// router.get('/add', (req, res) => {
//   const data = {
//     title: 'Users/add'
//   }
//   res.render('users/add', data)
// })

// router.post('/add', (req, res) => {
//   db.sequelize.sync()
//   .then(() => {
//     db.User.create({
//       name: req.body.name,
//       pass: req.body.pass,
//       mail: req.body.mail,
//       age: req.body.age
//     })
//   })
//   .then((usr) => {
//     res.redirect('/users')
//     // console.dir(usr)
//   })
// })

// router.post('/add',(req, res, next)=> {
//   db.sequelize.sync()
//     .then(() => db.User.create({
//       name: req.body.name,
//       pass: req.body.pass,
//       mail: req.body.mail,
//       age: req.body.age
//     }))
//     .then(usr => {
//       res.redirect('/users');
//     });
// });


router.get('/', (req, res) => {
  const id = req.query.id
  const nm = req.query.name
  // db.User.findAll({ where: {
    //  id: { [Op.lte]: id }
    // name: { [Op.like]: '%' + nm + '%'}
    // } })
  db.User.findAll({})
    .then(usrs => {
    // console.log('db qery no nakami')
    // console.dir(usrs)
    var data = {
      title: 'Users/Index',
      content: usrs,
    }
    res.render('./users', data)
  })
})

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
