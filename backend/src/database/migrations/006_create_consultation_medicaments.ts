import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('consultation_medicaments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('consultation_id').references('id').inTable('consultations').onDelete('CASCADE').notNullable();
    table.uuid('medicament_id').references('id').inTable('medicaments').onDelete('CASCADE').notNullable();
    table.text('posologie');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('consultation_medicaments');
} 