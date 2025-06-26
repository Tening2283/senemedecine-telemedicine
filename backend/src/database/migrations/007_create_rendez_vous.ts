import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rendez_vous', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE').notNullable();
    table.uuid('medecin_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.date('date').notNullable();
    table.time('heure').notNullable();
    table.text('motif').notNullable();
    table.enum('statut', ['CONFIRME', 'EN_ATTENTE', 'ANNULE']).defaultTo('EN_ATTENTE');
    table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('rendez_vous');
} 