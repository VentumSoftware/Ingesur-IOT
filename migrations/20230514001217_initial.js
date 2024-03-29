/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('Mensajes', table => {
            table.increments('ID').primary();
            table.bigInteger('Timestamp').notNullable();
            table.string("Raw").notNullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.destroy();
    return knex.schema .dropTable("Mensajes")
};
