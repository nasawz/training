const graphfrontRouter = require('./router/mainRouter');
const { Client, Pool } = require('pg');
const bodyParser = require('body-parser')

const dbPool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'graphfront'
})

// dbPool.connect((err) => {
//   if (err) {
//     console.error('connection error', err.stack)
//   } else {
//     console.log('connected')
//   }
// })

const express = require('express');
const ejs = require('ejs');

const app = express();


app.engine('html', ejs.renderFile);

app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(bodyParser.json())

// 该路由使用的中间件
app.use(function timeLog(req, res, next) {
  dbPool.query(`SELECT * FROM users 
  WHERE email='zhangsan@graphql.com'`, (err, result) => {
      req.user = result.rows[0]
      next();
    })
});

app.use('/', graphfrontRouter({ appPath: 'dashboard' }));

// app.get('/' + 'app', (req, res) => {
//   const vars = {};
//   console.log(req);
//   // if (!req.user) {
//   //   return res.redirect('/');
//   // }
//   // vars.currentUser = req.user;
//   // res.render(appPath, { vars });
//   res.send('Hello World!');
// });

app.listen(3002, () => {
  console.log('Go to http://localhost:3002');
});