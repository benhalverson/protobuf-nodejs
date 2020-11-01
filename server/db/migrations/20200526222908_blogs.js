exports.up = (knex) => {
  knex.schema.createTable('blogs', (table) => {
    table.increments();
    table.string('author').notNullable();
    table.string('title').notNullable();
    table.string('content').notNullable();
  });
};

exports.down = (knex) => {
  knex.schema.dropTable('blogs');
};
