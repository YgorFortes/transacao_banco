/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema.createTableIfNotExists('usuarios', (tabela)=>{
    tabela.increments('id').primary();
    tabela.string('nome',255).notNullable();
    tabela.string('email',255).unique().notNullable();
    tabela.string('senha',255).notNullable();
    tabela.timestamps(true, true)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
  return knex.schema.dropTable('usuarios');
};
