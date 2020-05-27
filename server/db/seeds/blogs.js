
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('blogs').del()
    .then(() =>
      // Inserts seed entries
      knex('blogs').insert([
        { author: 'Ben Halverson', title: 'seed title', content: 'First blog post' },
        { author: 'Ben Halverson', title: 'seed title', content: '2nd blog post' },
      ]));
};
