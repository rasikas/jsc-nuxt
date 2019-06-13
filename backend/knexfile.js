module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'db',
      user:     'name',
      password: 'user123!@#PK'
    },
    pool: {
      min: 1,
      max: 5
    }
  }
};
