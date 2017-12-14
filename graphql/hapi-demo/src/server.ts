import * as Hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';


import { makeExecutableSchema } from 'graphql-tools'

const HOST = 'localhost';
const PORT = 3000;


const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

const typeDefs = `
type Query { books: [Book] }
type Book { title: String, author: String }
`;

const resolvers = {
  Query: {
    books: () => {
      return books
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

async function StartServer() {
  const server = new Hapi.server({
    host: HOST,
    port: PORT,
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema: schema,
      },
      route: {
        cors: true,
      },
    },
  });

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql',
      },
    },
  });

  try {
    await server.start();
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`);
  }

  console.log(`Server running at: ${server.info.uri}`);
}

StartServer();