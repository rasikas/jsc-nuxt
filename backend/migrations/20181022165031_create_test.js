
exports.up = async (knex, Promise) => {
  await knex.schema
    .createTable('categories', (table) => {
      table.increments('id').primary()
      table.string('name')
    })
    .createTable('books', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.integer('categoryId').references('categories.id')
    })
    .createTable('pages', (table) => { // one book, many pages
      table.increments('id').primary()
      table.string('content')
      table.integer('bookId').references('books.id')
      // table.integer('ownerId').unsigned().references('id').inTable('persons').onDelete('SET NULL');
    })
    .createTable('authors', (table) => {
      table.increments('id').primary()
      table.string('name')
    })
    .createTable('books_authors', (table) => { // many books, many authors
      table.integer('bookId').unsigned().references('books.id')
      table.integer('authorId').unsigned().references('authors.id')
      table.unique(['bookId', 'authorId']) // remove this and you will have duplicates
    })
  return Promise.resolve()
}

exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('authors_books')
    .dropTableIfExists('pages')
    .dropTableIfExists('authors')
    .dropTableIfExists('books')
  return Promise.resolve()
}
