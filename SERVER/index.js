const express = require('express');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
const db = require('./db')
const port = 3000

app.use(bodyParser.json())
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(allowCrossDomain)

//admin routes
app.post('/admin/register', db.registerAdmin)
app.post('/admin/createFood', db.createFood)
app.post('/admin/comment', db.createAdminComment)
app.delete('/admin/deleteFood', db.deleteFood)
app.put('/admin/updateFood', db.updateFood)
app.put('/admin/checkOrder', db.checkOrder)
app.get('/admin/findNameAndDistrcitsById/:id', db.findNameAndDistrcitsById)
app.put('/admin/updateprofile', db.updateAdmin)
app.get('/admin/orders/:id', db.getOrders)
app.get('/admin/foods/:id', db.getAdminFoods)

//clients routes
app.post('/client/register', db.registerClient)
app.post('/client/comment', db.createClientComment)
app.post('/client/order', db.createOrder)
app.post('/client/history', db.getHistory)
app.post('/client/fav', db.getFavorites)
app.post('/client/allfoods', db.getFoods)
app.post('/client/ratefood', db.addRateToFood)
app.put('/client/updateprofile', db.updateClient)
app.get('/client/getorders/:id', db.getClientOrders)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })