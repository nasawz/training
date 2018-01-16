import Datastore from 'nedb';
import path from 'path';

module.exports = async () => {
  const categoryDb = new Datastore({
    filename: path.resolve(__dirname, '../db/category.db'),
    autoload: true,
  });

  return {
    categorys: categoryDb
  };
}