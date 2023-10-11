/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema.createTableIfNotExists('categorias', (tabela)=>{
    tabela.increments('id').primary();
    tabela.integer('usuario_id').notNullable().unsigned();
    tabela.foreign('usuario_id').references('usuarios.id').onUpdate('CASCADE').notNullable();
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
  return knex.schema.dropTable('categorias');
};
