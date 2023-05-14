// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development:{
    client: 'postgresql',
    connection: {
        client: 'pg',
        searchPath: ['knex', 'public'],
        database: 'ingesur-iot',
        user: 'postgres',
        password: 'password'
    },
    pool: {
        min: 5,
        max: 20
    },
    seeds: {
        directory: './seeds'
    },
    migrations: {
        tableName: 'knex_migrations'
      }
}

};
