const { genSaltSync, hashSync, compareSync, compare } = require('bcryptjs')
const db = require('../model/db')

exports.login = (req, res) => {
  console.log(req.session)
  console.log(req.body)
  let { email, password } = req.body
  db.start.query(
    'SELECT * FROM users WHERE email =?',
    [email],
    (err, results, fields) => {
      if (err) {
        console.log(err)
        // alert('some err')
        return res.redirect('/register')
      }
      console.log(results[0])
      if (results[0] == undefined) {
        // window.alert('there is some error')
        return res.redirect('/register')
      }
      console.log(results[0].email)
      console.log(results[0].password)
      if (compareSync(password, results[0].password)) {
        req.session.userId = results[0]
        // console.log(results[0].username)
        // req.sesion.username = results[0].username
        // req.session.contact = results[0].contact
        // req.session.address = results[0].address
        console.log('login successful')
        console.log(req.session)
        return res.redirect('/')
      } else {
        return res.redirect('/register')
      }
    }
  )
}
exports.redirectLogin = (req, res, next) => {
  console.log('hello from redirect login')
  console.log(req.session)
  if (!req.session.userId) {
    res.redirect('/register')
  } else {
    next()
  }
}
exports.redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}
exports.register = (req, res) => {
  let { name, email, phone, address, username, password } = req.body
  db.start.query(
    'SELECT * FROM users WHERE email=? or contact = ?',
    [email, phone],
    (err, results, fields) => {
      if (err) {
        console.log(err)
        return res.redirect('/')
      }
      if (results.length > 0) {
        return res.redirect('/')
      }
      const salt = genSaltSync(10)
      password = hashSync(password, salt)
      db.start.query(
        "insert into users(name,email,address,contact,username,password,position) values (?,?,?,?,?,?,'user')",
        [name, email, address, phone, username, password],
        (err, results, fields) => {
          if (err) {
            return res.redirect('/')
          } else {
            console.log(results)
            console.log('user added')
            return res.redirect('/')
          }
        }
      )
    }
  )
}
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    }
    res.clearCookie(process.env.SESSION_NAME)
    res.redirect('/')
  })
}
