const knexfile = require('./knexfile');
const knex = require('knex')(knexfile.development);

knex.raw("SELECT VERSION()").then(console.log).catch(e => { throw e }) .finally(knex.destroy);