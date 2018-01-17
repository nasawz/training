module.exports = {
  Query: {
    allDevices: async (root, { pager: { skip, limit } }, { db: { devices } }) => {
      return {
        totalCount: new Promise((resolve, reject) => {
          devices.count({}).exec((err, count) => (err ? reject(err) : resolve(count)));
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
    attributesConnection: ({ _id }, { pager: { skip, limit } }, { db: { devices, attributes } }) => {
      return {
        totalCount: new Promise((resolve, reject) => {
          attributes.count({ deviceId: _id }).exec((err, count) => (err ? reject(err) : resolve(count)));
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