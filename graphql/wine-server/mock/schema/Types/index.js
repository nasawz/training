const typeDefs = `
  # 设备
  type Device {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    attributesConnection(pager: Pager!): AttributesConnection!
  }

  type AttributesConnection {
    totalCount: Int
    data: [Attribute]
  }  

  type DevicesConnection {
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
    allDevices(pager: Pager!): DevicesConnection!
  }  

  input Pager {
    skip: Int
    limit: Int
  }     

`
module.exports = typeDefs 