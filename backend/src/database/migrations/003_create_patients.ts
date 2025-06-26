import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('patients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nom').notNullable();
    table.string('prenom').notNullable();
    table.date('date_naissance').notNullable();
    table.string('telephone').notNullable();
    table.string('email');
    table.text('adresse').notNullable();
    table.string('numero_patient').notNullable().unique();
    table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE').notNullable();
    table.uuid('medecin_referent_id').references('id').inTable('users').onDelete('SET NULL');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('patients');
} 