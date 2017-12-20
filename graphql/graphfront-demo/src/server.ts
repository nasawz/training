import * as express from 'express'
import * as graphfront from 'graphfront';
import { generator } from 'graphfront';
import { Client, Pool } from 'pg'

const dbPool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'graphfront'
})

dbPool.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

const app = express();

const graphfrontHTTP = graphfront({
  dbPool,
  apiKeyValidator: (apiKey) => {
    return true
  }
});
app.use('/graphql', graphfrontHTTP);

app.listen(3001, () => {
  console.log('Go to http://localhost:3001/graphql to run queries!');
});