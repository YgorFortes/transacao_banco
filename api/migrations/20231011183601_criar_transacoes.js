/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema.createTableIfNotExists('transacoes', (tabela)=>{
    tabela.increments('id').primary();
    tabela.text('descricao').notNullable();
    tabela.decimal('valor',10,2).notNullable();
    tabela.date('data').notNullable();
    tabela.integer('categoria_id').notNullable().unsigned();
    tabela.foreign('categoria_id').references('categorias.id').onUpdate('CASCADE');
    tabela.integer('usuario_id').notNullable().unsigned();
    tabela.foreign('usuario_id').references('usuarios.id').onUpdate('CASCADE');
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
  return knex.schema.dropTable('transacoes');
};
