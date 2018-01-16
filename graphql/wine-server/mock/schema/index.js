const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./Types/');
const resolvers = require('./Resolvers/')

module.exports = makeExecutableSchema({ typeDefs, resolvers });