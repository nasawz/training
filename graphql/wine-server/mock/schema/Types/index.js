const typeDefs = `
  # 设备
  type Device {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    propertiesConnection(skip: Int!, limit: Int!): PropertiesConnection!
  }

  # 设备属性
  type PropertiesConnection {
    # 总记录数
    totalCount: Int
    properties: [Property]
  }  

  # 设备属性
  type Property {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  # WINE iot 数据接口
  type Query {
    # 获取所有设备列表
    allDevices(skip: Int!, limit: Int!): [Device!]!
  }  

`
module.exports = typeDefs 