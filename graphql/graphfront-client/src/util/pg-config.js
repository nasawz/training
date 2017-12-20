const env = process.env;

module.exports = {
  development: {
    database: env.PG_DATABASE || 'graphfront',
    host: 'localhost',
    port: 5432,
    user: 'postgres'
  },

  production: {
    database: env.PG_DATABASE,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
  },
};
