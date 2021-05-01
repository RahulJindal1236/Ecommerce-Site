const db = require('../model/db')

exports.viewItem = (req, res) => {
  const prod_id = req.params.id
}

exports.cancel = (req, res) => {
  const prod_id = req.params.id
  db.start.query(
    'DELETE FROM ITEMS WHERE ITEMID = ?',
    [prod_id],
    (err, result, fields) => {
      if (err) {
        console.log('error in canceling order from admin')
        console.log(err)
      } else {
        console.log('order cancelled successfully')
      }
      return res.redirect('/admin')
    }
  )
}

exports.delivered = (req, res) => {
  const prod_id = req.params.id
  db.start.query(
    'DELETE FROM ITEMS WHERE ITEMID = ?',
    [prod_id],
    (err, result, fields) => {
      if (err) {
        console.log('error in updating db on delivering order from admin side')
        console.log(err)
      } else {
        console.log('order placed successfully')
      }
      return res.redirect('/admin')
    }
  )
}
