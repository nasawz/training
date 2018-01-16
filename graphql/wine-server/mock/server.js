const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const connectDb = require('./db-connector');
const { createServer } = require('http');
const schema = require('./schema');
const PORT = 3000;


const start = async () => {
  const db = await connectDb();
  var app = express();

  const buildOptions = async (req, res) => {
    return {
      context: {
        db,
      },
      schema,
    };
  };
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));


  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));

  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`wine GraphQL server running on port ${PORT}.`)
  });
};

start();