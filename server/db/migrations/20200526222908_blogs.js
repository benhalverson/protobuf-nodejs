
exports.up = function (knex, Promise) {
  return knex.schema.createTable('blogs', (table) => {
    table.increments();
    table.string('author').notNullable();
    table.string('title').notNullable();
    table.string('content').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('blogs');
};
