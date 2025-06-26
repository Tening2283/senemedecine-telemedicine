import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('medicaments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nom').notNullable();
    table.string('dosage').notNullable();
    table.string('frequence').notNullable();
    table.string('duree').notNullable();
    table.text('instructions');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('medicaments');
} 