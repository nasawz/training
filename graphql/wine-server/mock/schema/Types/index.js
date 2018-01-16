const typeDefs = `
  type Device {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    propertysConnection(skip: Int, first: Int): PropertysConnection!
  }

  type PropertysConnection {
    totalCount: Int
    propertys: [Property]
  }  

  type Property {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    allDevices(skip: Int, first: Int): [Device!]!
  }  

`
export default typeDefs 