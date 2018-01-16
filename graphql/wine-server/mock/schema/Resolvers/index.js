module.exports = {
  Query: {
    allDevices: async (root, { skip, limit }, { db: { devices } }) => {
      return new Promise((resolve, reject) => {
        devices
          .find({})
          .skip(skip)
          .limit(limit)
          .exec((err, res) => (err ? reject(err) : resolve(res)));
      })
    }
  },
  Device: {
    id: root => root._id || root.id,
    propertiesConnection: ({ _id }, { skip, limit }, { db: { devices, properties } }) => {
      return {
        totalCount: new Promise((resolve, reject) => {
          properties.find({ deviceId: _id }).exec((err, res) => (err ? reject(err) : resolve(res.length)));
        }),
        properties: new Promise((resolve, reject) => {
          properties
            .find({ deviceId: _id })
            .skip(skip)
            .limit(limit)
            .exec((err, res) => (err ? reject(err) : resolve(res)));
        })
      }
    }
  },
  PropertiesConnection: {},
  Property: {
    id: root => root._id || root.id
  }
}