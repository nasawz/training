import * as express from 'express'
import * as bodyParser from 'body-parser'

// import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

// import { makeExecutableSchema } from 'graphql-tools'

import { Client } from 'pg'

const dbPool = new Client({
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

// dbPool.query(`SELECT table_name
// FROM information_schema.tables
// WHERE table_type = 'BASE TABLE'
// AND table_schema = 'public'`).then(tablesRes => {
//     console.log(tablesRes);
//   }).catch((err) => {
//     console.log(err);
//   })


import * as graphfront from 'graphfront';
import { generator } from 'graphfront';

// // const dbPool = new Pool({
// //   host: 'localhost',
// //   user: 'database-user',
// //   max: 20,
// //   idleTimeoutMillis: 30000,
// //   connectionTimeoutMillis: 2000,
// // })

// // const { getSchema } = generator(dbPool, '111111');


// // const books = [
// //   {
// //     title: "Harry Potter and the Sorcerer's stone",
// //     author: 'J.K. Rowling'
// //   },
// //   {
// //     title: 'Jurassic Park',
// //     author: 'Michael Crichton'
// //   }
// // ];

// // const typeDefs = `
// // type Query { books: [Book] }
// // type Book { title: String, author: String }
// // `;

// // const resolvers = {
// //   Query: {
// //     books: () => {
// //       return books
// //     }
// //   }
// // }

// // const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express();

// const { getSchema } = generator(dbPool, '111111');
// app.use('/graphql', bodyParser.json(), getSchema)


const graphfrontHTTP = graphfront({
  dbPool,
  apiKeyValidator: (apiKey) => {
    return true
  }
});
app.use('/graphql', bodyParser.json(), graphfrontHTTP);


// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(3001, () => {
  console.log('Go to http://localhost:3001/graphql to run queries!');
});