const { request, response } = require('express')
const { Pool } = require('pg')
const { DbConfig } = require('./config')

const pool = new Pool(DbConfig)

const createAdminTable = async () => {
     const q = `CREATE TABLE IF NOT EXISTS admin (
            id SERIAL PRIMARY KEY UNIQUE,
            restaurant_name VARCHAR ( 255 ) NOT NULL,
            restaurant_district VARCHAR (255) NOT NULL,
            address VARCHAR (255) NOT NULL,
            service_districts VARCHAR[] NOT NULL,
            openning_hour INT NOT NULL,
            closing_hour INT NOT NULL,
            fixed_cost INT NOT NULL,
            fixed_time INT NOT NULL,
            password VARCHAR ( 50 ) NOT NULL,
            email VARCHAR ( 255 ) NOT NULL UNIQUE
    );`

     try {
          await pool.query(q)
     } catch (err) {
          console.log(err)
     }
}
const createFoodsTable = async () => {
     const q = `CREATE TABLE IF NOT EXISTS foods (
                  id SERIAL PRIMARY KEY UNIQUE,
                  name VARCHAR(255) NOT NULL,
                  owner_id INT NOT NULL,
                  status INT NOT NULL DEFAULT 1,
                  price INT NOT NULL,
                  comments_id INT[] DEFAULT '{}'
           );`

     try {
          await pool.query(q)
     } catch (err) {
          console.log(err.stack)
     }
}
const createClientsCommentsTable = async () => {
     const q = `CREATE TABLE IF NOT EXISTS client_comments (
                  id SERIAL PRIMARY KEY UNIQUE,
                  client_id INT NOT NULL,
                  content VARCHAR (140) NOT NULL,
                  rate INT NOT NULL,
                  food_id INT NOT NULL
           );`

     try {
          await pool.query(q)
     } catch (err) {
          console.log(err.stack)
     }
}
const createAdminsCommentsTable = async () => {
     const q = `CREATE TABLE IF NOT EXISTS admin_comments (
                  id SERIAL PRIMARY KEY UNIQUE,
                  admin_id INT NOT NULL,
                  reply_to_id INT NOT NULL,
                  content VARCHAR (140) NOT NULL
           );`

     try {
          await pool.query(q)
     } catch (err) {
          console.log(err.stack)
     }
}
const createOrdersTable = async () => {
     const q = `CREATE TABLE IF NOT EXISTS orders (
                  id SERIAL PRIMARY KEY UNIQUE,
                  client_id INT NOT NULL,
                  restaurant_id INT NOT NULL,
                  foods_id INT[] NOT NULL DEFAULT '{}',
                  price INT NOT NULL,
                  status INT NOT NULL DEFAULT 0
           );`

     try {
          await pool.query(q)
     } catch (err) {
          console.log(err.stack)
     }
}
const createClientsTable = async () => {
     const q = `CREATE TABLE IF NOT EXISTS clients (
                  id SERIAL PRIMARY KEY UNIQUE,
                  mobile VARCHAR(255) NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  name VARCHAR(255) NOT NULL,
                  district VARCHAR (255) NOT NULL,
                  address VARCHAR(255) NOT NULL,
                  property INT DEFAULT 1000,
                  orders_id INT[] DEFAULT '{}',
                  comments_id INT[] DEFAULT '{}',
                  history_orders_id INT[] DEFAULT '{}',
                  favorite_orders_id INT[] DEFAULT '{}'
           );`

     try {
          await pool.query(q)
     } catch (err) {
          console.log(err.stack)
     }
}
const registerAdmin = async (request, response) => {
     const q = `INSERT INTO admin (restaurant_name, restaurant_district, address, service_districts, openning_hour, closing_hour, fixed_cost, fixed_time, password, email)
               VALUES(
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
                    );`
     try {
          values = [request.body.restaurant_name, request.body.restaurant_district, request.body.address,
          request.body.service_districts, request.body.openning_hour, request.body.closing_hour, request.body.fixed_cost,
          request.body.fixed_time, request.body.password, request.body.email]
          await pool.query(q, values)
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const registerClient = async (request, response) => {
     const q = `INSERT INTO clients (mobile, password, name, district, address)
               VALUES(
                    $1,$2,$3,$4,$5
                    );`
     try {
          values = [request.body.mobile, request.body.password, request.body.name,
          request.body.district, request.body.address]
          await pool.query(q, values)
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const createFood = async (request, response) => {
     const q = `INSERT INTO foods (owner_id, name, price)
     VALUES(
          $1,$2, $3
          );`
     try {
          values = [request.body.owner_id, request.body.name, request.body.price]
          await pool.query(q, values)
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const createClientComment = async (request, response) => {
     const q = `INSERT INTO client_comments (client_id, content, rate, food_id)
     VALUES(
          $1,$2, $3, $4
          );`

     const q2 =  `UPDATE clients SET favorite_orders_id = array_append(favorite_orders_id, $1) WHERE id = $2`    
     try {
          values = [request.body.client_id, request.body.content, request.body.rate, request.body.food_id]
          await pool.query(q, values)

          if (request.body.rate > 3) {
               console.log(request.body.food_id)
               await pool.query(q2, [request.body.food_id, request.body.client_id])
          } 

          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const createAdminComment = async (request, response) => {
     const q = `INSERT INTO admin_comments (admin_id, reply_to_id, content)
     VALUES(
          $1,$2, $3
          );`
     try {
          values = [request.body.admin_id, request.body.reply_to_id, request.body.content]
          await pool.query(q, values)
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const createOrder = async (request, response) => {
     const q = `INSERT INTO orders (client_id, restaurant_id, foods_id, price)
     VALUES(
          $1,$2, $3, $4
          );`

     const q2 = `SELECT property FROM  clients WHERE id = $1` 
     const q3 = `UPDATE clients SET property = $1 WHERE id = $2`
     const q4 = `UPDATE clients SET history_orders_id = history_orders_id || $1 WHERE id = $2`

     try {
          values = [request.body.client_id, request.body.restaurant_id, request.body.foods_id, request.body.price]
          await pool.query(q, values)
          var oldProperty = await pool.query(q2, [request.body.client_id])
          oldProperty = oldProperty.rows[0].property
          const newProperty = oldProperty - request.body.price
          await pool.query(q3, [newProperty, request.body.client_id])
          await pool.query(q4, [request.body.foods_id, request.body.client_id])
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const deleteFood = async (request, response) => {
     const q = `DELETE FROM foods WHERE id = $1;`

     try {
          await pool.query(q, [request.body.id])
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const updateFood = async (request, response) => {
     const q = `UPDATE foods SET status = $1 WHERE id = $2;`

     try {
          await pool.query(q, [request.body.status, request.body.id])
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const checkOrder = async (request, response) => {
     const q = `UPDATE orders SET status = $1 WHERE id = $2`

     try {
          await pool.query(q, [request.body.status, request.body.id])
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const getHistory = async (request, response) => {
     const q = `SELECT history_orders_id FROM clients WHERE id = $1`
     const q2 = `SELECT * FROM foods WHERE id = any($1::int[])`

     try {
          let idx =  await pool.query(q, [request.body.id])
          idx = idx.rows[0].history_orders_id
          let foods = await pool.query(q2, [idx])
          response.status(200).json(foods.rows)
     } catch (err) {
          console.log(err.stack)
     }
}

const getFavorites = async (request, response) => {
 const q = `SELECT history_orders_id, favorite_orders_id FROM clients WHERE id = $1`
 const q2 = `SELECT * FROM foods WHERE id = any($1::int[])`

     try {
          let idx =  await pool.query(q, [request.body.id])
          history_idx = idx.rows[0].history_orders_id
          fav_idx = idx.rows[0].favorite_orders_id

          var counts = {};
          
          for (var i = 0; i < history_idx.length; i++) {
            var num = history_idx[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }
          const filteredByValue = Object.fromEntries(
               Object.entries(counts).filter(([key, value]) => value >= 5) )
               
          filtered = Object.keys(filteredByValue)
          const foods = await pool.query(q2, [filtered])
          response.status(200).json(foods.rows[0])
     } catch (err) {
          console.log(err.stack)
     }
}

//initialize: create tables for first time
createAdminTable()
createFoodsTable()
createClientsCommentsTable()
createAdminsCommentsTable()
createOrdersTable()
createClientsCommentsTable()
createClientsTable()

module.exports = {
     createAdminTable,
     createFoodsTable,
     createClientsCommentsTable,
     createAdminsCommentsTable,
     createOrdersTable,
     createClientsTable,
     registerAdmin,
     registerClient,
     createFood,
     createClientComment,
     createAdminComment,
     createOrder,
     deleteFood,
     updateFood,
     checkOrder,
     getHistory,
     getFavorites
}