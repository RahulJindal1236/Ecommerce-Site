const db = require('../model/db')

exports.myorders = (req, res) => {
  db.start.query(
    'select itemid,title,description,new_price,imglink,order_id from items join itemsbooked on items.itemid = itemsbooked.item_id where buyer_id = ?',
    [req.session.userId.email],
    (err, results, fields) => {
      if (err) {
        // throw err;
        console.log(err)
        return res.redirect(500, '/')
      }
      console.log(results[0])
      return res.status(200).render('myorders', { itemsbooked: results })
    }
  )
}

exports.buy = (req, res) => {
  const item_id = req.params.id
  console.log('inside buy')
  db.start.query(
    'SELECT * FROM ITEMS WHERE ITEMID = ?',
    [item_id],
    (e, row) => {
      db.start.query(
        'UPDATE ITEMS SET status = false where itemId=?',
        [item_id],
        (er, r) => {
          db.start.query(
            'INSERT INTO ITEMSBOOKED(ITEM_ID,SELLER_ID,BUYER_ID) VALUES(?,?,?)',
            [item_id, row[0].seller_id, req.session.userId.email],
            (err, result) => {
              if (err) {
                console.log(err)
                return res.redirect('/')
              }
              return res.redirect('/')
            }
          )
        }
      )
    }
  )
}

exports.allItems = (req, res) => {
  db.start.query(
    'SELECT * FROM ITEMS WHERE status = true and seller_id <> ?',
    [req.session.userId.email],
    (err, results, fields) => {
      if (err) {
        console.log('all Items')
        console.log(err)
        return res.redirect(500, '/')
      }
      return res
        .status(200)
        .render('products', { searchItems: [], items: results })
    }
  )
}

exports.myproducts = (req, res) => {
  db.start.query(
    'SELECT * FROM ITEMS WHERE SELLER_ID = ?',
    [req.session.userId.email],
    (err, results, fields) => {
      if (err) {
        console.log('myproducts')
        console.log(err)
        return res.redirect(500, '/')
      }
      return res.status(200).render('myproducts')
    }
  )
}

exports.sell = (req, res) => {
  const { title, description, price, imglink } = req.body
  if (title && description && price && imglink) {
    db.start.query(
      'INSERT INTO ITEMS(seller_id,title,description,price,new_price,imglink,status) VALUES(?,?,?,?,?,?,true)',
      [
        req.session.userId.email,
        title,
        description,
        price,
        1.05 * price,
        imglink,
      ],
      (err, results, fields) => {
        if (err) {
          console.log('item not added')
          console.log(err)
        } else {
          console.log('item added')
          console.log(results)
          return res.redirect('/myproducts')
        }
      }
    )
  }
}

exports.cancelItem = (req, res) => {
  console.log(req.url)
  const item_id = req.params.id
  db.start.query(
    'SELECT * FROM ITEMSBOOKED WHERE buyer_id = ? and item_id = ?',
    [req.session.userId.email, item_id],
    (err, results, fields) => {
      if (err) {
        console.log('error in retriving record to cancel item')
        console.log(err)
      }
      if (results) {
        db.start.query(
          'DELETE FROM ITEMSBOOKED WHERE BUYER_ID = ? AND ITEM_ID = ?',
          [req.session.userId.email, item_id],
          (err, result, fields) => {
            if (err) {
              console.log('error in cancelling item')
              console.log(err)
            } else {
              db.start.query(
                'UPDATE ITEMS SET status = true WHERE itemId = ?',
                [item_id],
                (e, row) => {
                  if (err) {
                    console.log(err)
                    return res.redirect('/')
                  } else {
                    console.log('item cancelled')
                    return res.redirect('/')
                  }
                }
              )
            }
          }
        )
      }
    }
  )
}

exports.delete = (req, res) => {
  console.log(req.url)
  const item_id = req.params.id
  console.log(item_id)
  db.start.query(
    'SELECT * FROM ITEMS WHERE itemId = ? and seller_id = ?',
    [item_id, req.session.userId.email],
    (err, results, fields) => {
      if (err) {
        console.log('cannot get item to delete')
        console.log(err)
      }
      if (results[0]) {
        db.start.query(
          'DELETE FROM ITEMS WHERE ITEMID = ? AND SELLER_ID = ?',
          [item_id, req.session.userId.email],
          (er, rows) => {
            if (er) {
              console.log('cannot delete item')
              console.log(er)
            }
            console.log('item deleted')
            return res.redirect('/myproducts')
          }
        )
      }
    }
  )
}

exports.viewItem = (req, res) => {
  console.log(req.params.id)
  const item_id = req.params.id
  db.start.query(
    'SELECT * FROM ITEMS WHERE ITEMID = ?',
    [item_id],
    (err, rows, fields) => {
      if (err) {
        console.log('cannot retrive view item from db')
        console.log(err)
        return res.redirect('/')
      }
      console.log(rows[0])
      if (rows[0]) {
        return res.render('viewItem', { item: rows[0] })
      }
    }
  )
}

exports.getMyOrders = (req, res) => {
  console.log('inside get my orders')
  db.start.query(
    'SELECT * FROM ITEMSBOOKED WHERE BUYER_ID = ? ORDER BY ORDER_ID DESC',
    [req.session.userId.email],
    (err, results, fields) => {
      if (err) {
        console.log('cannot retrive data')
        console.log(err)
        return res.redirect('/')
      }
      console.log(results)
      return res.render('myorders', { itemsbooked: results })
    }
  )
}

exports.getMyProducts = (req, res) => {
  console.log('inside getmyProducts')
  db.start.query(
    'SELECT * FROM ITEMS WHERE SELLER_ID = ? ORDER BY ITEMID DESC',
    [req.session.userId.email],
    (err, results, fields) => {
      if (err) {
        console.log('error in getMyProducts query')
        console.log(err)
        return res.redirect('/')
      }
      console.log(results)
      return res.render('myproducts', { items: results })
    }
  )
}

exports.search = (req, res) => {
  if (req.body.search) {
    // query to search all products
    console.log('search item' + req.body.search)
    db.start.query(
      `SELECT * FROM ITEMS WHERE status = true and seller_id <> ? and title like '%` +
        req.body.search +
        `%';`,
      [req.session.userId.email],
      (err, result, fields) => {
        if (err) {
          console.log('err in searching')
          console.log(err)
          return res.status(500).redirect('/')
        } else {
          console.log(result)
          db.start.query(
            'SELECT * FROM ITEMS WHERE status = true and seller_id <> ?',
            [req.session.userId.email],
            (e, results, flds) => {
              if (e) {
                console.log('all Items')
                console.log(e)
                return res.redirect(500, '/')
              }
              return res
                .status(200)
                .render('products', { searchItems: result, items: results })
            }
          )
        }
      }
    )
  } else {
    return res.redirect('/')
  }
}

exports.admin = (req, res) => {
  db.start.query('SELECT * FROM ITEMSBOOKED', (err, results, fields) => {
    if (err) {
      console.log('error in admin get req')
      console.log(err)
      return res.redirect('/')
    } else {
      console.log(results)
      return res.render('admin', { orders: results })
    }
  })
}
