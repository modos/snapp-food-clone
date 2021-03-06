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
                  restaurant_name VARCHAR(255) NOT NULL,
                  districts VARCHAR[] DEFAULT '{}',
                  status INT NOT NULL DEFAULT 1,
                  price INT NOT NULL,
                  time INT NOT NULL,
                  delivery_cost INT NOT NULL,
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
                  food_id INT NOT NULL,
                  res_id INT NOT NULl
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
                    ) RETURNING id;`
     try {
          values = [request.body.restaurant_name, request.body.restaurant_district, request.body.address,
          request.body.service_districts, request.body.openning_hour, request.body.closing_hour, request.body.fixed_cost,
          request.body.fixed_time, request.body.password, request.body.email]
          id = await pool.query(q, values)
          response.status(200).json(id.rows[0].id)
     } catch (err) {
          console.log(err.stack)
     }
}

const registerClient = async (request, response) => {
     const q = `INSERT INTO clients (mobile, password, name, district, address)
               VALUES(
                    $1,$2,$3,$4,$5
                    ) RETURNING *;`
     try {
          values = [request.body.mobile, request.body.password, request.body.name,
          request.body.district, request.body.address]
          id = await pool.query(q, values)
          response.status(200).json(id.rows[0])
     } catch (err) {
          console.log(err.stack)
     }
}

const createFood = async (request, response) => {
     const q = `INSERT INTO foods (owner_id, name, price, restaurant_name, districts, time, delivery_cost)
     VALUES(
          $1,$2, $3, $4, $5, $6, $7
          );`
     try {
          values = [request.body.owner_id, request.body.name, request.body.price,
                request.body.restaurant_name, request.body.districts, request.body.time, request.body.delivery_cost]
          await pool.query(q, values)
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const findNameAndDistrcitsById = async (request, response) => {
     const q = `SELECT restaurant_name, service_districts FROM admin WHERE id = $1`

     try {
          values = [request.params.id]
          let res = await pool.query(q, values)
          response.status(200).json(res.rows[0])
     } catch (err) {
          console.log(err.stack)
     }

}

const createClientComment = async (request, response) => {
     const q = `INSERT INTO client_comments (client_id, content, rate, food_id, res_id)
     VALUES(
          $1,$2, $3, $4, $5
          );`

     const q2 =  `UPDATE clients SET favorite_orders_id = array_append(favorite_orders_id, $1) WHERE id = $2`
     
     const q3 = `SELECT * FROM client_comments WHERE client_id = $1 AND food_id = $2`
     try {

          let res_q3 = await pool.query(q3, [request.body.client_id, request.body.food_id])
          if (res_q3.rowCount > 0){
                response.status(205).json("You already commented for this food")
                return
          }

          values = [request.body.client_id, request.body.content, request.body.rate, request.body.food_id, request.body.res_id]
          await pool.query(q, values)

          if (request.body.rate > 3) {
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

          const aCount = new Map([...new Set(history_idx)].map(
               x => [x, history_idx.filter(y => y === x).length]
           ));
               
           let h5 = history_idx.filter(function (e) {
               return aCount.get(e) > 5
           })

          let indexes_history = Object.values(h5)
          let indexes_favs = Object.values(fav_idx)

          let indexes = indexes_favs.concat(indexes_history)
          indexes = indexes.filter((x, i, a) => a.indexOf(x) == i)

          filtered = history_idx.ap
          const foods = await pool.query(q2, [indexes])
          response.status(200).json(foods.rows)
     } catch (err) {
          //console.log(err.stack)
     }
}

const getFoods = async (request, response) => {
     const q = `SELECT * FROM foods WHERE status = 1 AND $1 = ANY(districts)`
     try {
          let foods =  await pool.query(q, [request.body.district])
          response.status(200).json(foods.rows)
     } catch (err) {
          console.log(err.stack)
     }
}

const updateClient = async (request, response) => {
     const q = `UPDATE clients SET name = $1, mobile = $2, district = $3
                , password = $4, address = $5 WHERE id = $6;`

     try {
          await pool.query(q, [request.body.name, request.body.mobile, request.body.district
                              , request.body.password, request.body.address, request.body.id])
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const updateAdmin = async (request, response) => {
     const q = `UPDATE admin SET restaurant_name = $1, restaurant_district = $2, address = $3
     , service_districts = $4, openning_hour = $5, closing_hour = $6,
           fixed_cost = $7, fixed_time = $8, password = $9, email = $10  WHERE id = $11;`

     try {
          await pool.query(q, [request.body.restaurant_name, request.body.restaurant_district,
                               request.body.address
                              , request.body.service_districts, request.body.openning_hour, request.body.closing_hour,
                              request.body.fixed_cost,request.body.fixed_time,request.body.password, request.body.email,
                              request.body.id])
          response.status(200).json(100)
     } catch (err) {
          console.log(err.stack)
     }
}

const getOrders = async (request, response) => {
     const q = `SELECT * FROM orders WHERE restaurant_id = $1`
     try {
          let orders =  await pool.query(q, [request.params.id])
          response.status(200).json(orders.rows)
     } catch (err) {
          console.log(err.stack)
     }
}

const getClientOrders = async (request, response) => {
     const q = `SELECT * FROM orders WHERE client_id = $1`
     try {
          let orders =  await pool.query(q, [request.params.id])
          response.status(200).json(orders.rows)
     } catch (err) {
          console.log(err.stack)
     }
}

const getAdminFoods = async (request, response) => {
     const q = `SELECT * FROM foods WHERE owner_id = $1`

     try {
          let orders =  await pool.query(q, [request.params.id])
          response.status(200).json(orders.rows)
     } catch (err) {
          console.log(err.stack)
     }
}

const getComments = async (request, response) => {
     const q = `SELECT * FROM client_comments WHERE res_id = $1`
     try {
          let comments =  await pool.query(q, [request.params.id])
          response.status(200).json(comments.rows)
     } catch (err) {
          console.log(err.stack)
     }

}

function countItems(arr) {
     var a = [],
       b = [],
       prev;
   
     arr.sort();
     for (var i = 0; i < arr.length; i++) {
       if (arr[i] !== prev) {
         a.push(arr[i]);
         b.push(1);
       } else {
         b[b.length - 1]++;
       }
       prev = arr[i];
     }
   
     return [a, b];
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
     getFavorites,
     getFoods,
     findNameAndDistrcitsById,
     updateClient,
     updateAdmin,
     getOrders,
     getClientOrders,
     getAdminFoods,
     getComments
}