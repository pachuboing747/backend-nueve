const { Router } = require('express')
const path = require('path')
const productManager = require('../dao/managers/product.manager.js')
const cartsManager = require ("../dao/managers/cart.manager.js")
const isAuth = require('../middlewares/auth')

const router = Router()


router.get('/', async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const { docs: products, ...pageInfo } = await productManager.getAllPaged(page, size)

  pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&size=${size}` : ''
  pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&size=${size}` : ''


  req.session.homeCount = (req.session.homeCount || 0) + 1

  res.render('home', {
    title: 'Home',
    products,
    pageInfo,
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
    style: 'home'
  })
})

router.get('/chat', isAuth, (req, res) => {
  res.render('chat', { 
      user: req.user ?  {
      ...req.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
  })
})

router.get('/realtimesProducts', async (req, res) => {
 
  const products = await productManager.getAll()
 
  res.render('realTimeProducts', {
    title: 'Real Time',
    products,
    user: {
      ...req.user,
      isAdmin: req.user.role == 'admin',
    },
    style: 'home'
  })
})

router.get('/carts', async (req, res) => {

  const carts = await cartsManager.getAll()

  res.render('carts', {
    title: 'Carrito',
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
    carts,
  })
})

router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageValue = parseInt(page);
  const limitValue = parseInt(limit);

  const { docs: products, ...pageInfo } = await productManager.getAllPaged(pageValue, limitValue);

  res.render("products", {
    title: "Productos",
    products,
    pageInfo,
    style: "products"
  });
});

router.get('/profile', isAuth, (req, res) => {
  res.render('profile', {
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
  })
})


module.exports = router