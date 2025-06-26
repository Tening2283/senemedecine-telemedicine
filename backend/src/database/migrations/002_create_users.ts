import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable().unique();
    table.string('nom').notNullable();
    table.string('prenom').notNullable();
    table.enum('role', ['ADMIN', 'MEDECIN', 'SECRETAIRE', 'PATIENT']).notNullable();
    table.uuid('hopital_id').references('id').inTable('hopitaux').onDelete('CASCADE');
    table.string('telephone');
    table.string('specialite');
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
} 