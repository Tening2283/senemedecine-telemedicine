"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    return knex.schema.dropTable('images_dicom');
}
//# sourceMappingURL=008_create_images_dicom.js.map