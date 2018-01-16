const Datastore = require('nedb')
const path = require('path')

module.exports = async () => {
  const deviceDb = new Datastore({
    filename: path.resolve(__dirname, '../db/device.db'),
    autoload: true,
    timestampData: true
  });

  const propertyDb = new Datastore({
    filename: path.resolve(__dirname, '../db/property.db'),
    autoload: true,
    timestampData: true
  });


  return {
    devices: deviceDb,
    properties: propertyDb
  };
}
// const deviceDb = new Datastore({
//   filename: path.resolve(__dirname, '../db/device.db'),
//   autoload: true,
//   timestampData: true
// });

// const propertyDb = new Datastore({
//   filename: path.resolve(__dirname, '../db/property.db'),
//   autoload: true,
//   timestampData: true
// });


// deviceDb.insert({
//   name: '压缩机',
// }, (err, newDoc) => {
//   console.log(newDoc);
//   propertyDb.insert([
//     { name: '压缩机 属性1', deviceId: newDoc._id },
//     { name: '压缩机 属性2', deviceId: newDoc._id },
//     { name: '压缩机 属性3', deviceId: newDoc._id },
//     { name: '压缩机 属性4', deviceId: newDoc._id },
//     { name: '压缩机 属性5', deviceId: newDoc._id },
//     { name: '压缩机 属性6', deviceId: newDoc._id },
//     { name: '压缩机 属性7', deviceId: newDoc._id },
//     { name: '压缩机 属性8', deviceId: newDoc._id },
//     { name: '压缩机 属性9', deviceId: newDoc._id },
//     { name: '压缩机 属性10', deviceId: newDoc._id },
//     { name: '压缩机 属性11', deviceId: newDoc._id },
//   ], (err, res) => {
//     console.log(res);
//   })
// });


// deviceDb.insert({
//   name: '搅拌机',
// }, (err, newDoc) => {
//   console.log(newDoc);
//   propertyDb.insert([
//     { name: '搅拌机 属性1', deviceId: newDoc._id },
//     { name: '搅拌机 属性2', deviceId: newDoc._id },
//     { name: '搅拌机 属性3', deviceId: newDoc._id },
//     { name: '搅拌机 属性4', deviceId: newDoc._id },
//     { name: '搅拌机 属性5', deviceId: newDoc._id },
//     { name: '搅拌机 属性6', deviceId: newDoc._id },
//     { name: '搅拌机 属性7', deviceId: newDoc._id },
//     { name: '搅拌机 属性8', deviceId: newDoc._id },
//     { name: '搅拌机 属性9', deviceId: newDoc._id },
//     { name: '搅拌机 属性10', deviceId: newDoc._id },
//     { name: '搅拌机 属性11', deviceId: newDoc._id },
//   ], (err, res) => {
//     console.log(res);
//   })
// });
