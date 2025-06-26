import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('hopitaux', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nom').notNullable();
    table.text('adresse').notNullable();
    table.string('telephone').notNullable();
    table.string('email').notNullable().unique();
    table.string('ville').notNullable();
    table.boolean('actif').defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('hopitaux');
} 