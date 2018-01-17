const typeDefs = `
  # 设备
  type Device {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    attributesConnection(skip: Int!, limit: Int!): AttributesConnection!
  }

  type AttributesConnection {
    # 总记录数
    totalCount: Int
    data: [Attribute]
  }  

  type DevicesConnection {
    # 总记录数
    totalCount: Int
    data: [Device]
  }  

  # 设备属性
  type Attribute {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  # WINE iot 数据接口
  type Query {
    # 获取所有设备列表
    allDevices(skip: Int!, limit: Int!): DevicesConnection!
  }  

`
module.exports = typeDefs 