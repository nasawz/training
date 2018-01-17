module.exports = {
  Query: {
    allDevices: async (root, { skip, limit }, { db: { devices } }) => {
      return {
        totalCount: new Promise((resolve, reject) => {
          devices.find({}).exec((err, res) => (err ? reject(err) : resolve(res.length)));
        }),
        data: new Promise((resolve, reject) => {
          devices
            .find({})
            .skip(skip)
            .limit(limit)
            .exec((err, res) => (err ? reject(err) : resolve(res)));
        })
      }
    }
  },
  Device: {
    id: root => root._id || root.id,
    attributesConnection: ({ _id }, { skip, limit }, { db: { devices, attributes } }) => {
      return {
        totalCount: new Promise((resolve, reject) => {
          attributes.find({ deviceId: _id }).exec((err, res) => (err ? reject(err) : resolve(res.length)));
        }),
        data: new Promise((resolve, reject) => {
          attributes
            .find({ deviceId: _id })
            .skip(skip)
            .limit(limit)
            .exec((err, res) => (err ? reject(err) : resolve(res)));
        })
      }
    }
  },
  AttributesConnection: {},
  DevicesConnection: {},
  Attribute: {
    id: root => root._id || root.id
  }
}