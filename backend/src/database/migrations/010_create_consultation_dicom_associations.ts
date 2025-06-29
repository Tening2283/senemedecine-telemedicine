import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('consultation_dicom_associations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('consultation_id').notNullable().references('id').inTable('consultations').onDelete('CASCADE');
    table.string('orthanc_study_id').notNullable();
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['consultation_id']);
    table.index(['orthanc_study_id']);
    table.index(['created_by']);
    table.unique(['consultation_id', 'orthanc_study_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('consultation_dicom_associations');
} 