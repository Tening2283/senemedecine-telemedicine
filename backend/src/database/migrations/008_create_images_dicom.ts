import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('images_dicom', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('consultation_id').references('id').inTable('consultations').onDelete('CASCADE').notNullable();
    table.string('nom_fichier').notNullable();
    table.text('chemin_fichier').notNullable();
    table.bigInteger('taille').notNullable();
    table.string('type_mime').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('images_dicom');
} 